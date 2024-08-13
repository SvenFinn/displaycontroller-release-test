#!/bin/bash

npm run build

if [ ! -z "$MEYTON_DB_USER" ] && [ ! -z "$MEYTON_DB_PASS" ]; then
    cat << EOF > .env
MEYTON_DB_USER=$MEYTON_DB_USER
MEYTON_DB_PASS=$MEYTON_DB_PASS
EOF
else
    rm -f .env
    base="$(pwd)"
    while [ ! -f ".env" ] && [ "$(pwd)" != "/" ]; do
        cd ..
    done
    if [ -f ".env" ]; then
        source .env
        cd "$base"
        cat << EOF > .env
MEYTON_DB_USER=$MEYTON_DB_USER
MEYTON_DB_PASS=$MEYTON_DB_PASS
EOF
    else
        echo "No .env file found"
        exit 1
    fi
fi