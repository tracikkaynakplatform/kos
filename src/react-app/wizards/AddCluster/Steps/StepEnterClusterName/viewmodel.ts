import * as yup from "yup";
import { useWizard } from "kos-fe/contexts/WizardContext";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Logger } from "kos-shared/Logger";

export function useViewModel(props: DefaultStepProps) {
	const scheme = yup.object().shape({
		name: yup.string().required("Please enter cluster name").min(3, "Cluster name must be longer than 3 characters"),
	});
	const formMethods = useForm({ resolver: yupResolver(scheme) });
	const wizard = useWizard();

	const goToNextStep = formMethods.handleSubmit((values: any) => {
		wizard.updateData("name", values.name);
		props.goToNamedStep?.("addCluster");
	});

	const goBackStep = () => props.goToNamedStep?.("enterKubeconfig");

	const loadContextName = async () => {
		try {
			const contextName = await window["osAPI"]["getCurrentContext"](wizard.data.config);
			formMethods.setValue("name", contextName);
		} catch (err) {
			Logger.error(err);
		}
	};

	return {
		goToNextStep,
		goBackStep,
		formMethods,
		loadContextName,
	};
}
