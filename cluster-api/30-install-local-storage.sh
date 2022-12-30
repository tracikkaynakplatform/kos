#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

echo "installing local-storage to: $CLUSTER_NAME ."

kubectl --kubeconfig="$SCRIPT_PATH"/"$CLUSTER_NAME".kubeconfig \
  apply -f "$SCRIPT_PATH/local-path-storage.yaml"

echo "installed  local-storage to: $CLUSTER_NAME ."
