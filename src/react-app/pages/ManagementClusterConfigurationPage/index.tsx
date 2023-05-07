import { DashboardLayout, ReversibleLayout } from "kos-fe/layout";
import { useViewModel } from "./viewmodel";
import { FormProvider } from "kos-fe/contexts";
import { InputTextField } from "kos-fe/components/HookForm";
import { CircularProgress } from "kos-fe/components/UI";

export function ManagementClusterConfigurationPage() {
	const viewModel = useViewModel();

	return (
		<DashboardLayout>
			<ReversibleLayout>
				<div className="h-[100px]" />
				<FormProvider {...viewModel.formMethods}>
					{viewModel.isLoading ? (
						<div className="w-full flex items-center justify-center">
							<div className="w-[100px] h-[100px]">
								<CircularProgress text="Loading..." />
							</div>
						</div>
					) : (
						<>
							{viewModel.sections.map((section, index) => (
								<div key={index} className="flex flex-col p-3 w-6/12">
									<h2 className="font-bold text-xl">{section.label}</h2>
									<div className="flex flex-col w-ful gap-3">
										{Object.keys(section.fields).map((fieldKey, index) => (
											<InputTextField
												label={section.fields[fieldKey].label}
												key={index}
												name={fieldKey}
												defaultValue={section.fields[fieldKey].value}
											/>
										))}
									</div>
								</div>
							))}
							<div className="flex w-full items-center justify-center mt-5">
								<button className="w-1/12" onClick={viewModel.saveConfiguration}>
									Save
								</button>
							</div>
						</>
					)}
				</FormProvider>
			</ReversibleLayout>
		</DashboardLayout>
	);
}
