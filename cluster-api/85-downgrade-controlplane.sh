#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

NEW_VERSION="${2:-"v1.24.9"}"

echo "upgrading controlplane for: $CLUSTER_NAME to version: $NEW_VERSION ."

kubectl patch KubeadmControlPlane capi-quickstart-control-plane --type merge \
   -p "{\"spec\": {\"version\": \""$NEW_VERSION"\"} }"

echo "initiated upgrade for: $CLUSTER_NAME to version: $NEW_VERSION ."
echo "you can use 'kubectl get MachineDeployment' to check readiness status of controlplane nodes."

## Note: A rolling update of control nodes (/w 1 surge) is observed, one by one,
##   lasting for 10-15m. Nothing faulty is observed. Pods were all working 
##    (we did not expect otherwise).