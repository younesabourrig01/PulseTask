#!/bin/bash

# what developer shoild have from the platform 
TOKEN="secret token key generated"
API_URL="http://domain.com/api/cli/run-script"

# get the inputs from terminal
SCRIPT_SLUG=$1
SERVER_IP=$2

# send the request
curl -X POST "$API_URL" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d "{\"script_slug\": \"$SCRIPT_SLUG\", \"ip_address\": \"$SERVER_IP\"}"