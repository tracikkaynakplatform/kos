import React, { useState, useEffect } from "react";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../layouts";
import { kubeConfig, clusterConfig } from "../api";
import { PROVIDER_TYPE, providerNames, providerLogos } from "../providers";
import { useForm } from "react-hook-form";
import { logger } from "../logger";
import { InputText } from "../components/FormInputs";
import { Button } from "../components/UI/Button";
import { useCustomSnackbar } from "../hooks/useCustomSnackbar";
import { Loading } from "../components/Snackbars";

function InputRow({ name, label, control }) {
	return (
		<div className="flex justify-between items-center">
			<div className="w-64">{label}</div>
			<InputText
				rules={{
					required: "Lütfen değer giriniz",
				}}
				control={control}
				name={name}
				label={label}
			/>
		</div>
	);
}

export default function ManagementClusterConfigPage() {
	const [supportedProviders, setProviders] = useState([]);
	const [config, setConfig] = useState("");
	const { handleSubmit, control, setValue, getValues } = useForm();
	const { enqueueSnackbar: snack, closeSnackbar } = useCustomSnackbar();
	const nav = useNavigate();
	const { name } = useParams();

	const parseField = (name) => {
		return [
			name.substring(0, name.indexOf("_")),
			name.substring(name.indexOf("_") + 1),
		];
	};

	const handleSave = handleSubmit(async (fields) => {
		const loading = snack(
			"Yapılandırma kayıt ediliyor",
			{ persist: true },
			Loading
		);
		try {
			const currentConfig =
				(await clusterConfig.getClusterConfiguration(name)) ?? {};

			if (!currentConfig.provider) currentConfig.provider = {};

			for (let data of Object.keys(fields)) {
				const [providerName, dataName] = parseField(data);
				if (!currentConfig.provider[providerName])
					currentConfig.provider[providerName] = {};
				currentConfig.provider[providerName][dataName] = fields[data];
			}

			await clusterConfig.setClusterConfiguration(name, currentConfig);
			snack("Küme bilgileri kayıt edildi.", { variant: "info" });
		} catch (err) {
			logger.error(err.message);
			snack("Bir hata oluştu!", { variant: "error" });
		}
		closeSnackbar(loading);
	});

	useEffect(() => {
		(async () => {
			if (!name) {
				snack("Küme adı belirtilmedi!", {
					variant: "error",
					autoHideDuration: 5000,
				});
				return;
			}
			const _config = await kubeConfig.loadManagementConfig(name);
			const providers = await clusterConfig.getSupportedProviders(
				_config
			);
			setConfig(_config);
			setProviders(providers);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			// Load provider's configurations
			const currentConfig = await clusterConfig.getClusterConfiguration(
				name
			);
			const fields = getValues();
			for (let field of Object.keys(fields)) {
				const [providerName, fieldName] = parseField(field);
				setValue(
					field,
					currentConfig?.provider[providerName]?.[fieldName]
				);
			}
		})();
	}, [supportedProviders]);

	return (
		<DashboardLayout>
			<div className="flex flex-col gap-5 p-5">
				<Button variant="fab" onClick={() => nav(-1)}>
					<ArrowBackIcon />
				</Button>
				{supportedProviders.map((x, i) => {
					let content;
					let providerName = providerNames[x];
					let providerLogo = providerLogos[x];

					switch (x) {
						case PROVIDER_TYPE.AWS:
						case PROVIDER_TYPE.AWS_EKS:
							content = (
								<div className="flex flex-col gap-3">
									<InputRow
										control={control}
										name="AWS_AWS_ACCESS_KEY_ID" /* Every configuration row must starts with provider name that depend on */
										label="Erişim Anahtarı"
									/>
									<InputRow
										control={control}
										name="AWS_AWS_SECRET_ACCESS_KEY"
										label="Gizli Erişim Anahtarı"
									/>
									<InputRow
										control={control}
										name="AWS_AWS_B64ENCODED_CREDENTIALS"
										label="Base64 Kimlik Bilgileri"
									/>
									<InputRow
										control={control}
										name="AWS_AWS_REGION"
										label="Bölge"
									/>
								</div>
							);
							break;
						case PROVIDER_TYPE.DOCKER:
							return null;
					}
					return (
						<div key={i} className="flex flex-col gap-5">
							<h2 className="text-2xl font-sans flex gap-3 items-center">
								<img
									src={providerLogo}
									className="rounded-full w-10 h-10"
								/>
								{providerName} yapılandırması
							</h2>
							{content}
							<hr />
						</div>
					);
				})}
				<Button
					className="w-32 text-lg self-center"
					onClick={handleSave}
				>
					Kaydet
				</Button>
			</div>
		</DashboardLayout>
	);
}
