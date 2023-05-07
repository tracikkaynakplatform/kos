import { getManagementCluster, updateManagementCluster } from "kos-fe/api/management-cluster";
import { useComponentDidMount } from "kos-fe/hooks/useComponentDidMount";
import { Infrastructure } from "kos-fe/models/Infrastructure";
import { ConfigurationSection } from "./types";
import { modalErrorHandler } from "kos-fe/wrappers/modalErrorHandler";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AWSConfiguration } from "kos-fe/models/ManagementClusterConfiguration/AWSConfiguration";
import { Configuration, fillConfiguration } from "kos-fe/models/ManagementClusterConfiguration";
import { toast } from "react-toastify";

export function useViewModel() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [sections, setSections] = useState<ConfigurationSection[]>([]);
	const formMethods = useForm();
	const navigate = useNavigate();
	const { managementClusterName } = useParams();

	useComponentDidMount(() =>
		modalErrorHandler(
			async () => {
				const managementCluster = await getManagementCluster(managementClusterName);
				const configurationSections: ConfigurationSection[] = [];
				for (const supportedInfastructure of managementCluster.supportedInfrastructures) {
					switch (supportedInfastructure) {
						case Infrastructure.AWS:
							configurationSections.push({
								fields: fillConfiguration(AWSConfiguration, managementCluster.configuration),
								label: "AWS",
							});
							break;
					}
				}
				setSections(configurationSections);
			},
			() => navigate(-1),
			() => setIsLoading(false)
		)
	);

	const saveConfiguration = formMethods.handleSubmit((values: any) => {
		toast.promise(
			async () => {
				await updateManagementCluster(managementClusterName, null, values);
			},
			{
				pending: "Saving configurations",
				success: "Configurations saved",
				error: "Unable to save configurations",
			}
		);
	});

	return {
		isLoading,
		formMethods,
		sections,
		saveConfiguration,
	};
}
