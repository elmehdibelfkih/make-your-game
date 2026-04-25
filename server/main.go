package main

import (
	"encoding/json"
	"errors"
	"log"
	"math"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
)

type Score struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

type ScoreWithRank struct {
	Name  string `json:"name"`
	Rank  int    `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

type ScoreResponse struct {
	Scores      []ScoreWithRank `json:"scores"`
	TotalScores int             `json:"totalScores"`
	Percentile  float64         `json:"percentile,omitempty"`
	Position    int             `json:"position,omitempty"`
}

var (
	scores     []Score
	scoresFile = "scores.json"
	mu         sync.RWMutex
)

const MAX_ITEMS_PER_PAGE = 5

func main() {
	loadScores()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/scores", handleScores)
	mux.HandleFunc("/api/health", handleHealth)

	log.Printf("Server starting on port %s", ":8080")
	if err := http.ListenAndServe(":"+"8080", enableCORS(mux)); err != nil {
		log.Fatal(err)
	}
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func handleScores(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case "POST":
		handlePostScore(w, r)
	case "GET":
		handleGetScores(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func validateScore(score Score) error {
	name := strings.TrimSpace(score.Name)
	if name == "" || len(name) < 4 || len(name) > 12 {
		return errors.New("Name must be between 4 and 12 characters")
	}
	points := score.Score
	if points < 0 || points > math.MaxInt32 {
		return errors.New("Score must be a valid integer")
	}

	if score.Time == "" {
		return errors.New("Time is required")
	}
	return nil
}

func handlePostScore(w http.ResponseWriter, r *http.Request) {
	var newScore Score
	if err := json.NewDecoder(r.Body).Decode(&newScore); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := validateScore(newScore); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mu.Lock()
	scores = append(scores, newScore)

	sortScores()
	saveScores()

	position := 1
	for i, s := range scores {
		if s.Name == newScore.Name && s.Score == newScore.Score && s.Time == newScore.Time {
			position = i + 1
			break
		}
	}

	total := len(scores)
	percentile := 0.0
	if total > 0 {
		percentile = (float64(total-position+1) / float64(total)) * 100
	}

	topLimit := 5
	if total < 5 {
		topLimit = total
	}

	topScores := make([]ScoreWithRank, topLimit)
	for i := 0; i < topLimit; i++ {
		topScores[i] = ScoreWithRank{
			Name:  scores[i].Name,
			Rank:  i + 1,
			Score: scores[i].Score,
			Time:  scores[i].Time,
		}
	}
	mu.Unlock()

	response := ScoreResponse{
		Scores:      topScores,
		TotalScores: total,
		Percentile:  percentile,
		Position:    position,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func sortScores() {
	sort.Slice(scores, func(i, j int) bool {
		return scores[i].Score > scores[j].Score
	})
}

func handleGetScores(w http.ResponseWriter, r *http.Request) {
	page := 1
	pageStr := r.URL.Query().Get("page")
	if pageStr != "" {
		if parsed, err := strconv.Atoi(pageStr); err == nil && parsed > 0 {
			page = parsed
		}
	}

	start := (page - 1) * MAX_ITEMS_PER_PAGE
	end := start + MAX_ITEMS_PER_PAGE

	mu.RLock()
	total := len(scores)

	if start > total {
		start = total
	}
	if end > total {
		end = total
	}

	pagedScores := make([]ScoreWithRank, end-start)
	for i, s := range scores[start:end] {
		pagedScores[i] = ScoreWithRank{
			Name:  s.Name,
			Rank:  start + i + 1,
			Score: s.Score,
			Time:  s.Time,
		}
	}
	mu.RUnlock()

	response := ScoreResponse{
		Scores:      pagedScores,
		TotalScores: total,
	}

	json.NewEncoder(w).Encode(response)
}

func loadScores() {
	data, err := os.ReadFile(scoresFile)
	if err != nil {
		scores = []Score{}
		return
	}

	if err := json.Unmarshal(data, &scores); err != nil {
		log.Printf("Error parsing scores: %v", err)
		scores = []Score{}
	}

	sortScores()
}

func saveScores() {
	data, err := json.MarshalIndent(scores, "", "  ")
	if err != nil {
		log.Printf("Error marshaling scores: %v", err)
		return
	}

	if err := os.WriteFile(scoresFile, data, 0o644); err != nil {
		log.Printf("Error saving scores: %v", err)
	}
}
