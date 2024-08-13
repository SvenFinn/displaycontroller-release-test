#!/bin/bash

npm run build

if [ ! -z "$SELF_DB_URL" ]; then
    echo "SELF_DB_URL=$SELF_DB_URL" > .env
else
    rm -f .env
    base="$(pwd)"
    while [ ! -f ".env" ] && [ "$(pwd)" != "/" ]; do
        cd ..
    done
    if [ -f ".env" ]; then
        source .env
        cd "$base"
        echo "SELF_DB_URL=$SELF_DB_URL" > .env
    else
        echo "No .env file found"
        exit 1
    fi
fi