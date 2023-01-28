import { getMachineDeployments } from "../../../main/api/kubectl";
import { logger } from "../../../main/logger";
import { KubeConfig } from "../../../main/k8s/KubeConfig"; "../../../main/k8s/KubeConfig";


test(`testing api/kubectl getMachineDeployments`, async () => {
  let kubeConfig = await KubeConfig.defaultConfig();
  let machines = await getMachineDeployments(kubeConfig, {cluster_name: "capi-quickstart"});

  logger.debug(`machine deployments = ${machines}`);

  expect(machines.length > 0).toBeTruthy();
});
