#!/bin/bash

# Start the first process
node ./server/index.js &
server_pid=$!

# Start the second process
node ./sync/index.js &
sync_pid=$!

# Receive sigterm
trap 'kill -TERM $server_pid $sync_pid' TERM

# Wait for either process to exit or receive sigterm
wait -n 

exit $?