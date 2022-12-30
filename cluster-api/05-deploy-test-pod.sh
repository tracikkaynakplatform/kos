#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

echo "installing test pod to: $CLUSTER_NAME ."


## Set Node Name::

POD_NODE_NAME="ip-10-0-77-189.eu-west-1.compute.internal"  envsubst < "$SCRIPT_PATH/test-pod.yaml" | kubectl --kubeconfig="$SCRIPT_PATH"/"$CLUSTER_NAME".kubeconfig \
  apply -f -

echo "installed  test pod to: $CLUSTER_NAME ."

## output log:

# ls -al local-path-storage/pvc-4a4a5f54-7286-47be-b3fa-885efe3e3077_default_logs-sb-bench-0/