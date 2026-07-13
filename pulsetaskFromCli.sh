#!/bin/bash

TOKEN="secrete token generated"
BASE_URL="http://domain.com/api/cli"

ACTION=$1

if [ "$ACTION" == "run" ]; then
    SCRIPT_SLUG=$2
    SERVER_IP=$3

    if [ -z "$SCRIPT_SLUG" ] || [ -z "$SERVER_IP" ]; then
        echo "Usage: pt run <script_slug> <server_ip>"
        exit 1
    fi

    curl -s -X POST "$BASE_URL/run-script" \
         -H "Authorization: Bearer $TOKEN" \
         -H "Content-Type: application/json" \
         -H "Accept: application/json" \
         -d "{\"script_slug\": \"$SCRIPT_SLUG\", \"ip_address\": \"$SERVER_IP\"}" | json_pp

elif [ "$ACTION" == "status" ]; then
    RUN_ID=$2

    if [ -z "$RUN_ID" ]; then
        echo "Usage: pt status <run_id>"
        exit 1
    fi

    curl -s -X GET "$BASE_URL/run-status/$RUN_ID" \
         -H "Authorization: Bearer $TOKEN" \
         -H "Accept: application/json" | json_pp

else
    echo "Unknown action! Use 'run' or 'status'."
    echo "Examples:"
    echo "  ./pulsetaskFromCli.sh run deploy-app 192.168.1.50"
    echo "  ./pulsetaskFromCli.sh status 42"
fi