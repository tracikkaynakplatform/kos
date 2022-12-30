 #!/bin/bash
 
echo "installing clusterawsadm..."

curl -L https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases/download/v2.0.2/clusterawsadm-linux-amd64 -o clusterawsadm
chmod +x clusterawsadm
sudo mv clusterawsadm /usr/local/bin
clusterawsadm version
