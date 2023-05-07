import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWizard } from "kos-fe/contexts/WizardContext";
import { useState } from "react";
import { Infrastructure } from "kos-fe/models/Infrastructure";
import { SelectOption } from "kos-fe/components/UI/Select/types";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { toast } from "react-toastify";
import { InfrastructureIcon } from "kos-fe/models/InfrastructureIcon";
import { getManagementCluster } from "kos-fe/api/management-cluster";

export function useViewModel(props: DefaultStepProps) {
	const schema = yup.object().shape({
		infrastructure: yup.object().required("Please select an infrastructure"),
	});

	const [infrastructures, setInfrastructures] = useState<SelectOption[]>([]);
	const { managementClusterName } = useParams();
	const formMethods = useForm({ resolver: yupResolver(schema) });
	const wizard = useWizard();

	const isLoading = () => infrastructures.length == 0;

	const loadInfrastructures = () => {
		setInfrastructures([]);
		toast.promise(
			async () => {
				const managementCluster = await getManagementCluster(managementClusterName);

				setInfrastructures(
					managementCluster.supportedInfrastructures.map((infra, index) => ({
						id: index,
						label: infra,
						value: infra,
						icon: InfrastructureIcon[infra],
					}))
				);
			},
			{ error: "Unable to retrieve infrastructure list" }
		);
	};

	const goToNextStep = formMethods.handleSubmit((values: any) => {
		wizard.updateData("infrastructure", values.infrastructure.value);
		if (values.infrastructure.value != Infrastructure.Docker) {
			props.goToNamedStep?.("selectRegion");
		} else {
			wizard.updateData("lastStep", "selectInfrastructure");
			props.goToNamedStep?.("enterClusterInformation");
		}
	});

	return {
		formMethods,
		infrastructures,
		goToNextStep,
		isLoading,
		loadInfrastructures,
	};
}
