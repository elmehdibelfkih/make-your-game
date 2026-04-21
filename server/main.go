package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sort"
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

func main() {
	loadScores()

	http.HandleFunc("/api/scores", handleScores)
	http.HandleFunc("/api/health", handleHealth)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, enableCORS(http.DefaultServeMux)); err != nil {
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

func handlePostScore(w http.ResponseWriter, r *http.Request) {
	var newScore Score
	if err := json.NewDecoder(r.Body).Decode(&newScore); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if newScore.Name == "" || newScore.Score < 0 || newScore.Time == "" {
		http.Error(w, "Invalid score data", http.StatusBadRequest)
		return
	}

	mu.Lock()
	scores = append(scores, newScore)
	saveScores()
	mu.Unlock()

	position, percentile := calculatePosition(newScore.Score)

	response := ScoreResponse{
		Scores:      getTopScores(5),
		TotalScores: len(scores),
		Percentile:  percentile,
		Position:    position,
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func handleGetScores(w http.ResponseWriter, r *http.Request) {
	mu.RLock()
	defer mu.RUnlock()

	response := ScoreResponse{
		Scores:      getAllScoresWithRank(),
		TotalScores: len(scores),
	}

	json.NewEncoder(w).Encode(response)
}

func calculatePosition(score int) (int, float64) {
	mu.RLock()
	defer mu.RUnlock()

	sortedScores := make([]Score, len(scores))
	copy(sortedScores, scores)
	sort.Slice(sortedScores, func(i, j int) bool {
		return sortedScores[i].Score > sortedScores[j].Score
	})

	position := 1
	for i, s := range sortedScores {
		if s.Score == score {
			position = i + 1
			break
		}
	}

	total := len(scores)
	percentile := 0.0
	if total > 0 {
		percentile = (float64(total-position+1) / float64(total)) * 100
	}

	return position, percentile
}

func getTopScores(limit int) []ScoreWithRank {
	mu.RLock()
	defer mu.RUnlock()

	sortedScores := make([]Score, len(scores))
	copy(sortedScores, scores)
	sort.Slice(sortedScores, func(i, j int) bool {
		return sortedScores[i].Score > sortedScores[j].Score
	})

	end := limit
	if len(sortedScores) < limit {
		end = len(sortedScores)
	}

	result := make([]ScoreWithRank, end)
	for i := 0; i < end; i++ {
		result[i] = ScoreWithRank{
			Name:  sortedScores[i].Name,
			Rank:  i + 1,
			Score: sortedScores[i].Score,
			Time:  sortedScores[i].Time,
		}
	}

	return result
}

func getAllScoresWithRank() []ScoreWithRank {
	sortedScores := make([]Score, len(scores))
	copy(sortedScores, scores)
	sort.Slice(sortedScores, func(i, j int) bool {
		return sortedScores[i].Score > sortedScores[j].Score
	})

	result := make([]ScoreWithRank, len(sortedScores))
	for i, score := range sortedScores {
		result[i] = ScoreWithRank{
			Name:  score.Name,
			Rank:  i + 1,
			Score: score.Score,
			Time:  score.Time,
		}
	}

	return result
}

func loadScores() {
	data, err := os.ReadFile(scoresFile)
	if err != nil {
		if os.IsNotExist(err) {
			scores = []Score{}
			return
		}
		log.Printf("Error loading scores: %v", err)
		scores = []Score{}
		return
	}

	if err := json.Unmarshal(data, &scores); err != nil {
		log.Printf("Error parsing scores: %v", err)
		scores = []Score{}
	}
}

func saveScores() {
	data, err := json.MarshalIndent(scores, "", "  ")
	if err != nil {
		log.Printf("Error marshaling scores: %v", err)
		return
	}

	if err := os.WriteFile(scoresFile, data, 0644); err != nil {
		log.Printf("Error saving scores: %v", err)
	}
}
