#!/usr/bin/env bash

echo "creating and initializing aws cluster..."

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CMD=$(which clusterctl)
if [ $? -ne 0 ]; then
  $SCRIPT_PATH/clusterctl-install.sh
fi

CMD=$(which clusterawsadm)
if [ $? -ne 0 ]; then
  $SCRIPT_PATH/clusterawsadm-install.sh
fi

# clusterawsadm bootstrap iam create-cloudformation-stack
clusterctl init --infrastructure aws
## last minor of 2 previous major: 1.23.15
## last minor of previous major: 1.24.9
## last minor of last major: 1.25.5

## note that for now, aws provider is using Ubuntu 18.04.6 LTS images by default.
sleep 4

### //TODO: looks for EC2 key named `kos` in that region.

clusterctl generate cluster capi-quickstart \
  --kubernetes-version v1.24.9 \
  --control-plane-machine-count=3 \
  --worker-machine-count=3 \
  | kubectl apply -f -

echo "completed aws cluster initialization. Wait for a few minutes for it to get launched."
echo "you can use `kubectl get Kubeadmcontrolplane` to check readiness status of pods."
echo "Note that, a CNI solution is still needed to make the nodes and controlplane ready."
