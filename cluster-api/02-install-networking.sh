#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

echo "applying cluster networking to cluster: $CLUSTER_NAME ."

clusterctl get kubeconfig capi-quickstart > "$SCRIPT_PATH"/"$CLUSTER_NAME".kubeconfig

## now can also use (in another terminal) 
##   export KUBECONFIG="${HOME}"/kos/kos-electron/cluster-api/capi-quickstart.kubeconfig
 
kubectl --kubeconfig="$SCRIPT_PATH"/"$CLUSTER_NAME".kubeconfig \
  apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/calico.yaml

echo "applied cluster networking to $CLUSTER_NAME . Wait for a few minutes, for it to become available."
