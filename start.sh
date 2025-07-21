#!/bin/bash

echo "Beginning selective purge. Only frontend sinners will be punished..."

# Stop containers, but don't kill all volumes
docker compose down --remove-orphans

# Remove only volumes with "frontend" in the name
for vol in $(docker volume ls --format '{{.Name}}' | grep frontend); do
	echo "Deleting volume: $vol"
	docker volume rm "$vol"
done

# Clear frontend build if present
rm -rf ./frontend/build

# Prune networks to keep Docker's haunted memory clean
docker network prune -f

echo "Running: docker compose up --build -d"

# Rebuild and restart
docker compose up --build -d

echo "Ready!"