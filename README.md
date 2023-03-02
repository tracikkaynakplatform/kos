# KOS
KOS (Kubernetes Orchestration System) Project is a set of client/server utilities aimed at easing (multiple) kubernetes cluster generation and management. It utilizes the [cluster-api](https://cluster-api.sigs.k8s.io/) project for this purpose and supports all of its provider backends (Docker, AWS, //TODO: Openstack, Azure, GCP, ...). It provides a UI via [electronjs](https://www.electronjs.org/).

# Requirements
It requires a proper management cluster (formed using cluster-api). See [cluster-api concepts](https://cluster-api.sigs.k8s.io/user/concepts.html) and related documentation. You just need to provide a [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) (with proper permissions) for this cluster to KOS frontend/app and you will have access the features explained below.

# Features
- [+] manage (add/remove) management clusters (for personal use).
- [+] add/delete clusters
- [ ] update clusters (add/remove machines)
- [+] upgrade clusters (version upgrades)
- [*] fetch kubeconfig and open cluster management services/apps (kubernetes dashboard or lens).


# Supported providers (backends):
- [+] Docker
- [+] AWS
- [ ] Openstack
- [ ] Azure
- [ ] GCP


# Contributing
@see [CONTRIBUTING.md](./CONTRIBUTING.md).