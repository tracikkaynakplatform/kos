#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

NODE_NAME="${2:-"ip-10-0-77-89.eu-west-1.compute.internal"}"

echo "installing test pod to: $CLUSTER_NAME attaching to node: $NODE_NAME."


## Set Node Name::

POD_NODE_NAME="$NODE_NAME"  envsubst < "$SCRIPT_PATH/test-pod.yaml" | kubectl --kubeconfig="$SCRIPT_PATH"/"$CLUSTER_NAME".kubeconfig \
  apply -f -

echo "installed  test pod to: $CLUSTER_NAME ."

## output log:

# ls -al local-path-storage/pvc-4a4a5f54-7286-47be-b3fa-885efe3e3077_default_logs-sb-bench-0/