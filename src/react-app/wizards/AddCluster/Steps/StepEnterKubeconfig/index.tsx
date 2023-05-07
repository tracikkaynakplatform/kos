import { InputTextField } from "kos-fe/components/HookForm";
import { FormProvider } from "kos-fe/contexts";
import { StepWrapper } from "kos-fe/wizards";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useViewModel } from "./viewmodel";

export function StepEnterKubeconfig(props: DefaultStepProps) {
	const viewModel = useViewModel(props);

	return (
		<StepWrapper
			stepName={props.stepName}
			onLoad={viewModel.loadDefaultKubeconfig}
			onNextClick={viewModel.goToNextStep}
			title="Management cluster's kubeconfig"
			width={700}
			text={
				<>
					Enter kubeconfig content of your management cluster.
					<br />
					{viewModel.defaultKubeconfigPath && (
						<div>
							<i>{viewModel.defaultKubeconfigPath}</i> file loaded
						</div>
					)}
				</>
			}
			disableBack
		>
			<FormProvider {...viewModel.formMethods}>
				<InputTextField rows={10} name="config" className="h-[30px]" />
			</FormProvider>
		</StepWrapper>
	);
}
