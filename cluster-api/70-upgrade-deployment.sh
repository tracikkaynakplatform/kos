#!/usr/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

CLUSTER_NAME="${1:-"capi-quickstart"}"

NEW_VERSION="${2:-"v1.25.5"}"

echo "upgrading deployment (machines) for: $CLUSTER_NAME to version: $NEW_VERSION ."

## upgrading individual machines did not invoke a change...
# kubectl patch machine capi-quickstart-md-0-6b7d6b8cf5-224xs --type merge \
#    -p "{\"spec\": {\"version\": \""$NEW_VERSION"\"} }"


kubectl patch MachineDeployment capi-quickstart-md-0 --type merge \
   -p "{\"spec\": { \"template\": { \"spec\": {\"version\": \""$NEW_VERSION"\"} } } }"

## upgrading MachineDeployment 

## test-pod is lost.. We had to recreate it anyway, since node names are changed:
## When we try to re-apply, we get: 

# Events:
#   Type     Reason       Age                 From     Message
#   ----     ------       ----                ----     -------
#   Warning  FailedMount  60s                 kubelet  Unable to attach or mount volumes: unmounted volumes=[local-path-storage], unattached volumes=[local-path-storage kube-api-access-7zbhd]: timed out waiting for the condition
#   Warning  FailedMount  55s (x9 over 3m3s)  kubelet  MountVolume.SetUp failed for volume "local-path-storage" : hostPath type check failed: /local-path-storage is not a directory

## yep! it seems that that hostpath is not created yet!.. Rolling update created new machines,
## added them one by one to the cluster and removed the old ones..
## when we describe sb-bench-0 pod:
# Warning  FailedScheduling  12s (x5 over 20m)  default-scheduler  0/6 nodes are available: 3 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: }, 6 node(s) had volume node affinity conflict. preemption: 0/6 nodes are available: 6 Preemption is not helpful for scheduling.

## yep! volume/node-affinity conflict. Rancher local-storage attaches node-affinity to volumes.
##  Trying to change it results with an error: 'field is immutable '. 
##  we have to delete pvs, pvcs (and probably the statefulset) *in reverse order*,
##  We absolutely have already lost the storage! There's no need to go further.

## AWS recommends its own (dynamic) storage options, like EFS.
##  EFS can be used both for machine generated and EKS clusters.
##   //TODO: check if supports write-many, as it is a kind of network storage options.

echo "initiated deployment (machine) upgrade for: $CLUSTER_NAME to version: $NEW_VERSION ."
echo "you can use 'kubectl get MachineDeployment' to check readiness status of pods."

## Note: A rolling update of control nodes (/w 1 surge) is observed, 
##   lasting for 10-15m. Nothing faulty is observed.