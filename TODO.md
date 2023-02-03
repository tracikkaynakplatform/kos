# TODO items:
Note: put a minus inside item selector, prior to constructing a task for it..

- [x] Upon selecting (clicking) the management cluster, a yellow notification appears on the bottom left of the window and disappears instantly.
    managementclusterinfo
- [ ] AWS settings should be applied first, before creating any cluster and this info is not available to the end user.
    +LOWPRI
  - [ ] no info if the datum is valid.
  - [x] default region should be pre-selected in create cluster dialogue.
    - [x] Err for 2 etcd nodes is not available.
- [x] button tooltips (in cluster selection, ...etc screen) are not available..
- [ ] there's no edit cluster dialogue (to add/remove nodes)...
    +HARDWORK
- [x] control plane should come pre-selected on upgrade dialogue..
- [ ] cluster-create,  
- [ ] cannot close cni dialogue, when in progress..
        in slow regions ?? may not be able to pass to cni stage
- [ ] num of external ip per region !!
- [ ] should invoke refresh, in cluster-list screen, while deleting ...etc.
    +LOWPRI


- [ ] add button stays at the bottom-right in src/react-app/pages/ManagementClustersPage.jsx. Could not fiz it via changing its order !
    +UIUNITY
- [*] CircularProgress is not displaying ??
       it is still compiling front-end code in the background.