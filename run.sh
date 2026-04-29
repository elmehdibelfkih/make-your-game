#!/bin/bash

cd "$(dirname "$(realpath "$0")")/server"
echo "Starting Scoreboard API Server..."
go run main.go
