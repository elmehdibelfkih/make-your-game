#!/bin/bash

cd "$(dirname "$0")"
echo "Starting Scoreboard API Server..."
go run main.go
