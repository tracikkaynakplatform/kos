import * as yup from "yup";
import { useWizard } from "kos-fe/contexts/WizardContext";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { Logger } from "kos-shared/Logger";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export function useViewModel(props: DefaultStepProps) {
	const schema = yup.object().shape({
		config: yup.string().required("Please enter kubeconfig"),
	});

	const [defaultKubeconfigPath, setDefaultKubeconfigPath] = useState<string>("");
	const formMethods = useForm({ resolver: yupResolver(schema) });
	const wizard = useWizard();

	const loadDefaultKubeconfig = async () => {
		// NOTE: This is possible just for electron application
		try {
			const response = await window["osAPI"]["getDefaultKubeconfig"]();
			Logger.log(response);
			formMethods.setValue("config", response.content);
			setDefaultKubeconfigPath(response.path);
		} catch (err) {
			Logger.error(err);
		}
	};

	const goToNextStep = formMethods.handleSubmit((values: any) => {
		wizard.updateData("config", values.config);
		props.goToNamedStep("enterClusterName");
	});

	return {
		formMethods,
		goToNextStep,
		loadDefaultKubeconfig,
		defaultKubeconfigPath,
	};
}
