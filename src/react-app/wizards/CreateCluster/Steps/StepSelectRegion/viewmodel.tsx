import * as yup from "yup";
import { getRegionList } from "kos-fe/api/management-cluster";
import { useWizard } from "kos-fe/contexts";
import { DefaultStepProps } from "kos-fe/wizards/types";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { SelectOption } from "kos-fe/components/UI/Select/types";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

export function useViewModel(props: DefaultStepProps) {
	const schema = yup.object().shape({
		region: yup.object().required("Please select a region"),
	});

	const [regions, setRegions] = useState<SelectOption[]>([]);
	const { managementClusterName } = useParams();
	const formMethods = useForm({ resolver: yupResolver(schema) });
	const wizard = useWizard();

	const isLoading = () => regions.length == 0;

	const loadRegions = () => {
		setRegions([]);
		toast.promise(
			async () => {
				if (!managementClusterName) {
					toast.error("Invalid route");
					return;
				}
				const regions = await getRegionList(managementClusterName, wizard.data.infrastructure);
				setRegions(
					regions.map((region, index) => ({
						id: index,
						label: region,
						value: region,
					}))
				);
			},
			{
				error: {
					render({ data }) {
						return <>{data?.toString()}</>;
					},
				},
			}
		);
	};

	const goBack = () => props.goToNamedStep?.("selectInfrastructure");

	const goNext = formMethods.handleSubmit((values: any) => {
		wizard.updateData("region", values.region.value);
		props.goToNamedStep?.("infrastructureConfig");
	});

	return {
		formMethods,
		regions,
		loadRegions,
		goBack,
		goNext,
		isLoading,
	};
}
