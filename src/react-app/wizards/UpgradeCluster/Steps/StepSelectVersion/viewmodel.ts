import { getManagementCluster } from "kos-fe/api/management-cluster";
import { getPossibleControlPlaneVersions, getPossibleWorkerVersions } from "kos-fe/api/management-cluster/cluster";
import { SelectOption } from "kos-fe/components/UI/Select/types";
import { useWizard } from "kos-fe/contexts";
import { versionToString } from "kos-fe/models/Version";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function useViewModel(props: DefaultStepProps) {
	const [possibleVersions, setPossibleVersions] = useState<SelectOption[]>([]);
	const [currentVersion, setCurrentVersion] = useState<string | null>(null);
	const { managementClusterName, clusterName } = useParams();
	const formMethods = useForm();
	const wizard = useWizard();

	const loadVersions = async () => {
		setPossibleVersions([]);
		setCurrentVersion(null);

		try {
			const managementCluster = await getManagementCluster(managementClusterName);
			const cluster = managementCluster.clusters.find((x) => x.name == clusterName);

			if (wizard.data.upgradeNode == "worker") {
				setCurrentVersion(versionToString(cluster.workerNode.version));
			} else {
				setCurrentVersion(versionToString(cluster.controlPlaneNode.version));
			}
		} catch (err) {}

		toast.promise(
			async () => {
				let versions;

				if (wizard.data.upgradeNode == "worker") {
					versions = await getPossibleWorkerVersions(managementClusterName, clusterName);
				} else {
					versions = await getPossibleControlPlaneVersions(managementClusterName, clusterName);
				}
				console.log(versions);
				setPossibleVersions(
					versions.map((version, index) => ({
						id: index,
						label: version,
						value: version,
					}))
				);
			},
			{ error: "Unable to retrieve versions list" }
		);
	};

	const isLoading = () => possibleVersions.length == 0;

	const goBack = () => {
		props.goToNamedStep("selectUpgradeNode");
	};

	const goNext = formMethods.handleSubmit((values: any) => {
		wizard.updateData("version", values.version.value);
		props.goToNamedStep("upgrade");
	});

	return {
		formMethods,
		possibleVersions,
		currentVersion,
		goBack,
		goNext,
		loadVersions,
		isLoading,
	};
}
