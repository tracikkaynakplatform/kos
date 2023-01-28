import { getMachineDeployments, getMachineDeploymentVersionInfo, getControlPlaneVersionInfo, isRolloutInProgress } from "../../../main/api/kubectl";
import { logger } from "../../../main/logger";
import { KubeConfig } from "../../../main/k8s/KubeConfig"; "../../../main/k8s/KubeConfig";


test(`testing api/kubectl getMachineDeployments`, async () => {
  let kubeConfig = await KubeConfig.defaultConfig();
  let machines = await getMachineDeployments(kubeConfig, {cluster_name: "capi-quickstart"});

  logger.debug(`machine deployments = ${machines}`);

  expect(machines.length > 0).toBeTruthy();
});

test(`testing api/kubectl getMachineDeploymentVersionInfo`, async () => {
  let kubeConfig = await KubeConfig.defaultConfig();
  let machine = await getMachineDeploymentVersionInfo(kubeConfig, {resource_name: "capi-quickstart-md-0"});

  logger.debug(`machine deployment = \n${JSON.stringify(machine)}`);

  expect(machine.kind == "MachineDeployment").toBeTruthy();
});

test(`testing api/kubectl getControlPlaneVersionInfo`, async () => {
  let kubeConfig = await KubeConfig.defaultConfig();
  let machine = await getControlPlaneVersionInfo(kubeConfig, {cluster_name: "capi-quickstart"});

  logger.debug(`ControlPlane = \n${JSON.stringify(machine, null, 4)}`);
  expect(machine.kind == "KubeadmControlPlane").toBeTruthy();
  // expect(machines.length > 0).toBeTruthy();
});

test(`testing api/kubectl isRolloutInProgress`, async () => {
  let kubeConfig = await KubeConfig.defaultConfig();
  let controlPlane = await getControlPlaneVersionInfo(kubeConfig, {cluster_name: "capi-quickstart"});
  let machineDep = await getMachineDeploymentVersionInfo(kubeConfig, {resource_name: "capi-quickstart-md-0"});

  // logger.debug(`ControlPlane = \n${JSON.stringify(machine, null, 4)}`);

  let isControlPlaneUpgrading =  isRolloutInProgress(controlPlane);
  let isMachineDeploymentUpgrading =  isRolloutInProgress(machineDep);

  //will all return false or null..
  expect(isControlPlaneUpgrading).not.toBeTruthy();
  expect(isMachineDeploymentUpgrading).not.toBeTruthy();
});
