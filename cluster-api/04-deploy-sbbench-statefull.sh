#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

echo "installing sb-bench ss to: $CLUSTER_NAME ."

kubectl --kubeconfig="$SCRIPT_PATH"/"$CLUSTER_NAME".kubeconfig \
  apply -f "$SCRIPT_PATH/sbbench-stateful.yaml"

echo "installed  sb-bench ss to: $CLUSTER_NAME ."
