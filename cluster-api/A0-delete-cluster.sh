#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

echo "deleting cluster: $CLUSTER_NAME ."

kubectl delete cluster "$CLUSTER_NAME"

echo "deleted cluster: $CLUSTER_NAME ."
echo "You can consider deleting your management cluster (via 'kind delete cluster' ...etc)," 
echo "  iff there's no other workload cluster."

## NOTES: deletion took more than 5m. I did manually invoke node termination
##    on console, but I don't know if this has made any difference or not.


