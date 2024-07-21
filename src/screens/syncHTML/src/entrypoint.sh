#!/bin/bash

mkdir -p $SRV_TMP_DIR

# Start the first process
node ./server/index.js &

# Start the second process
node ./sync/index.js &

# Wait for either process to exit
wait -n

exit $?