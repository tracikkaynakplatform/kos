import * as yup from "yup";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getMachineTypes } from "kos-fe/api/management-cluster/getMachineTypes";
import { useWizard } from "kos-fe/contexts";
import { getKeyPairs } from "kos-fe/api/management-cluster/getKeyPairs";
import { SelectOption } from "kos-fe/components/UI/Select/types";
import { yupResolver } from "@hookform/resolvers/yup";

export function useViewModel(props: DefaultStepProps) {
	const schema = yup.object().shape({
		sshKeyName: yup.object().required("Select a SSH key"),
		controlPlaneMachineType: yup.object().required("Select a machine type"),
		workerMachineType: yup.object().required("Select a machine type"),
	});

	const [keyPairs, setKeyPairs] = useState<SelectOption[]>([]);
	const [machineTypes, setMachineTypes] = useState<SelectOption[]>([]);
	const { managementClusterName } = useParams();
	const wizard = useWizard();
	const formMethods = useForm({ resolver: yupResolver(schema) });

	const isLoading = () => keyPairs.length == 0 || machineTypes.length == 0;

	const loadOptions = () => {
		setKeyPairs([]);
		setMachineTypes([]);
		toast.promise(
			async () => {
				// NOTE: Maybe we won't need a dynamic instance type list.
				const mTypes: string[] = ["t3.small", "t3.medium", "t3.large", "t3.xlarge"]; //await getMachineTypes(managementClusterName, wizard.data.infrastructure, wizard.data.region);
				setMachineTypes(
					mTypes.map((machineType, index) => ({
						id: index.toString(),
						label: machineType,
						value: machineType,
					}))
				);

				const kPairs = await getKeyPairs(managementClusterName, wizard.data.infrastructure, wizard.data.region);
				setKeyPairs(
					kPairs.map((keyPair, index) => ({
						id: index.toString(),
						label: keyPair,
						value: keyPair,
					}))
				);
			},
			{ error: "Unable retrieve options" }
		);
	};

	const goBack = () => props.goToNamedStep?.("selectRegion");

	const goNext = formMethods.handleSubmit((values: any) => {
		wizard.updateData("sshKeyName", values.sshKeyName.value);
		wizard.updateData("controlPlaneMachineType", values.controlPlaneMachineType.value);
		wizard.updateData("workerMachineType", values.workerMachineType.value);
		wizard.updateData("lastStep", "infrastructureConfig");
		props.goToNamedStep?.("enterClusterInformation");
	});

	return {
		formMethods,
		machineTypes,
		keyPairs,
		isLoading,
		loadOptions,
		goNext,
		goBack,
	};
}
