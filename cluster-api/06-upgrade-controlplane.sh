#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

NEW_VERSION="${2:-"v1.25.5"}"

echo "upgrading controlplane for: $CLUSTER_NAME to version: $NEW_VERSION ."

kubectl patch KubeadmControlPlane capi-quickstart-control-plane --type merge \
   -p "{\"spec\": {\"version\": \""$NEW_VERSION"\"} }"

echo "initiated upgrade for: $CLUSTER_NAME to version: $NEW_VERSION ."

## Note: A rolling update of control nodes (/w 1 surge) is observed, 
##   lasting for 10-15m. Nothing faulty is observed.