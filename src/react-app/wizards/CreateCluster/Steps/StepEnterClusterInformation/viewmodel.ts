import * as yup from "yup";
import { SelectOption } from "kos-fe/components/UI/Select/types";
import { versions } from "kos-fe/models/KubernetesVersions";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWizard } from "kos-fe/contexts/WizardContext";
import { Infrastructure } from "kos-fe/models/Infrastructure";

export function useViewModel(props: DefaultStepProps) {
	const schema = yup.object().shape({
		name: yup.string().required("Please enter cluster name").min(3, "Cluster name must be at least 3 character"),
		// kubernetesVersion: // maybe we won't need that
		controlPlaneCount: yup.number().moreThan(0, "Enter control plane count more than 0").required("Please enter control plane count"),
		workerCount: yup.number().moreThan(0, "Enter worker count more than 0").required("Please enter worker count"),
	});

	const formMethods = useForm({ resolver: yupResolver(schema) });
	const wizard = useWizard();
	const versionOptions: SelectOption[] = versions.map((version, index) => ({
		id: index,
		label: version,
		value: version,
	})) as SelectOption[];

	const goToNextStep = formMethods.handleSubmit((values) => {
		wizard.updateData("name", values.name);
		wizard.updateData("kubernetesVersion", values.kubernetesVersion.value);
		wizard.updateData("controlPlaneCount", values.controlPlaneCount);
		wizard.updateData("workerCount", values.workerCount);
		props.goToNamedStep("createCluster");
	});

	const goBack = () => {
		props.goToNamedStep(wizard.data.lastStep);
	};

	return {
		formMethods,
		versionOptions,
		goToNextStep,
		goBack,
	};
}
