# KOS

KOS (Kubernetes Orchestration System) Project is a set of client/server utilities aimed at easing (multiple) kubernetes cluster generation and management. It utilizes the [cluster-api](https://cluster-api.sigs.k8s.io/) project for this purpose and supports all of its provider backends (Docker, AWS, //TODO: Openstack, Azure, GCP, ...). It provides a UI via [electronjs](https://www.electronjs.org/).

# Requirements

It requires a proper management cluster (formed using cluster-api). See [cluster-api concepts](https://cluster-api.sigs.k8s.io/user/concepts.html) and related documentation. You just need to provide a [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) (with proper permissions) for this cluster to KOS frontend/app and you will have access the features explained below.

# Features

-   [+] manage (add/remove) management clusters (for personal use).
-   [+] add/delete clusters
-   [ ] update clusters (add/remove machines)
-   [+] upgrade clusters (version upgrades)
-   [*] fetch kubeconfig and open cluster management services/apps (kubernetes dashboard or lens).

# Supported providers (backends):

-   [+] Docker
-   [+] AWS
-   [ ] Openstack
-   [ ] Azure
-   [ ] GCP

# Screenshots
![KOS_add_cluster_dialogue_tr](https://github.com/user-attachments/assets/bca102bd-0283-4923-8b54-93f76188110b)

![KOS_add_cluster_waitingForCNI_tr](https://github.com/user-attachments/assets/865d4e99-5f6d-4506-baa8-20193cc02a25)

![KOS_clusters_tr](https://github.com/user-attachments/assets/c6062b00-9336-4038-9fb1-9b7dd3ea7efb)

![KOS_delete_cluster_tr](https://github.com/user-attachments/assets/aa69465e-9bbc-402b-b4dd-30a418095143)

![KOS_upgrade_cluster_tr](https://github.com/user-attachments/assets/93cdb72a-1f10-4bc9-92be-f386fdb913de)

# Contributing

@see [CONTRIBUTING.md](./CONTRIBUTING.md).
