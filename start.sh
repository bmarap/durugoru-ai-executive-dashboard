#!/bin/sh

# Start the Node.js API in the background
cd /api
node server.js &

# Start Nginx in the foreground
nginx -g "daemon off;"
