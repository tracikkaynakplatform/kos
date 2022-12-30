 #!/bin/bash
 
 echo "installing clusterctl..."
 
 curl -L https://github.com/kubernetes-sigs/cluster-api/releases/download/v1.3.1/clusterctl-linux-amd64 -o clusterctl
 sudo install -o root -g root -m 0755 clusterctl /usr/local/bin/clusterctl
 clusterctl version
