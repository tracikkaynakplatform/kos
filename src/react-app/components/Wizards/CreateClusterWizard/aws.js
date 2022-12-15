import React from "react";
import { clusterConfig, aws, env, services, os } from "../../../api";
import { logger } from "../../../logger";
import { envVariables } from "../../../providers/aws";
import MessageModal from "../../Modals/MessageModal";

export async function checkConfig(
	goToNamedStep,
	modal,
	manClusterName,
	region
) {
	const info = await getAWSInfo(manClusterName, region);
	if (!info) {
		modal.showModal(MessageModal, {
			message:
				"AWS sağlayıcısı için gerekli yapılandırma bulunamadı. Lütfen yönetim kümesinin detay sayfasından AWS sağlayıcısının yapılandırmasını girin.",
		});
		goToNamedStep("selectAWSClusterType");
		return;
	}
	return info;
}

export async function checkAWSCli(goToNamedStep, modal) {
	if (!(await services.checkService("aws")).status) {
		modal.showModal(MessageModal, {
			message: (
				<div>
					aws-cli aracı bulunamadı. Lütfen KOS'u yeniden başlatmayı
					deneyin veya{" "}
					<a
						className="inline-block"
						onClick={() =>
							os.openLink(
								"https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
							)
						}
					>
						bu adreste
					</a>{" "}
					tarif ediliği şekilde aws-cli aracını kurun ve YOL üzerine
					ekleyin.
				</div>
			),
		});
		goToNamedStep("selectAWSClusterType");
		return false;
	}
	return true;
}

export async function getAWSInfo(managementClusterName, region) {
	let credentials = await clusterConfig.getClusterConfiguration(
		managementClusterName
	);

	try {
		credentials = credentials.provider.AWS;
	} catch (err) {
		logger.error(err.message);
		return;
	}

	for (let config of envVariables)
		if (credentials[config.name] == "")
			credentials[config.name] = await env.getEnv(config.name);

	return {
		regions: await aws.listRegions(credentials),
		sshKeys: await aws.listKeyPairs(
			credentials,
			"ec2",
			region ?? credentials.AWS_REGION
		),
	};
}
