# Scoreboard API Server

A Go-based REST API service for managing game scoreboards.

## Features

- POST endpoint to save new scores
- GET endpoint to retrieve all scores with rankings
- Automatic ranking and percentile calculation
- JSON file-based persistence
- CORS enabled for browser access

## API Endpoints

### POST /api/scores
Submit a new score.

**Request Body:**
```json
{
  "name": "Player Name",
  "score": 14356,
  "time": "05:40"
}
```

**Response:**
```json
{
  "scores": [
    {
      "name": "Kave",
      "rank": 1,
      "score": 233254,
      "time": "12:01"
    },
    ...
  ],
  "totalScores": 100,
  "percentile": 94.5,
  "position": 3
}
```

### GET /api/scores
Retrieve all scores with rankings.

**Response:**
```json
{
  "scores": [
    {
      "name": "Kave",
      "rank": 1,
      "score": 233254,
      "time": "12:01"
    },
    ...
  ],
  "totalScores": 100
}
```

### GET /api/health
Health check endpoint.

## Running the Server

```bash
cd server
go run main.go
```

The server will start on port 8080 by default. You can change the port by setting the PORT environment variable:

```bash
PORT=3000 go run main.go
```

## Building

```bash
go build -o scoreboard-server
./scoreboard-server
```

## Data Storage

Scores are stored in `scores.json` in the same directory as the server executable.
