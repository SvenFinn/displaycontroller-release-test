#! /bin/bash

cd "$(dirname "$0")/.."

PROXY_NAME="dc-reverse-proxy"
APP_PORT=80

# Stop the containers if they are running
docker compose stop

# Start the containers
docker compose up&

# Wait for the proxy to be healthy
docker events --filter 'event=health_status' | while read event; do
    if echo "$event" | grep "$PROXY_NAME" | grep -q " healthy "; then
        break;
    fi
done

# Start unclutter
unclutter -idle 0.1 -root &

# Start chromium browser as kiosk 
chromium-browser # Me needs to add parameters, but i dont have them here

# Stop the containers
docker compose stop

