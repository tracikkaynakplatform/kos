import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TempLayout } from "../layouts";
import { kubeConfig, clusterConfig, env } from "../api";
import { PROVIDER_TYPE, providerNames, providerLogos } from "../providers";
import { useForm } from "react-hook-form";
import { logger } from "../logger";
import { InputText } from "../components/FormInputs";
import { Button } from "../components/UI/Button";
import { useCustomSnackbar } from "../hooks/useCustomSnackbar";
import { Loading } from "../components/Snackbars";
import { envVariables } from "../providers/aws";
import { handleErrorWithSnack } from "../errorHandler";

function InputRow({ name, label, control, fieldLabel }) {
	return (
		<div className="flex justify-between items-center">
			<div className="w-[20%]">{fieldLabel}:</div>
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
	const [warnings, setWarnings] = useState("");
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
		await handleErrorWithSnack(snack, async () => {
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
			snack("Küme bilgileri kayıt edildi.", { variant: "info", autoHideDuration: 4000 });
		});
		setTimeout( () => closeSnackbar(loading), 1000);
		// closeSnackbar(loading);
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
			handleErrorWithSnack(snack, async () => {
				const _config = await kubeConfig.loadManagementConfig(name);
				const providers = await clusterConfig.getSupportedProviders(
					_config
				);
				setConfig(_config);
				setProviders(providers);
			});
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
				const value =
					currentConfig?.provider[providerName]?.[fieldName];
				if (!value && (await env.getEnv(fieldName)))
					setWarnings((old) => (
						<>
							{old}
							{old && <br />}* {fieldName} isimli konfigürasyon
							çevre değişkenlerinden alındı
						</>
					));

				setValue(field, value || (await env.getEnv(fieldName)) || "");
			}
		})();
	}, [supportedProviders]);

	return (
		<TempLayout>
			<div className="h-28" />
			{warnings && (
				<div className="p-5 bg-yellow-400/40">
					{warnings}
					<br />
					<br />
					Bu konfigürasyonlar çevre değişkenlerinden alındı. Bu
					ayarları KOS ile birlikte kullanmak için aşağıdaki kaydet
					butonuna tıklayın.
				</div>
			)}
			<div className="flex flex-col gap-5 p-5">
				{supportedProviders.length > 0 ? (
					supportedProviders.map((x, i) => {
						let content;
						let providerName = providerNames[x];
						let providerLogo = providerLogos[x];

						switch (x) {
							case PROVIDER_TYPE.AWS:
							case PROVIDER_TYPE.AWS_EKS:
								content = (
									<div className="flex flex-col gap-3">
										{envVariables.map((x, i) => (
											<InputRow
												key={i}
												control={control}
												name={"AWS_" + x.name}
												fieldLabel={x.label}
												label={x.name}
											/>
										))}
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
					})
				) : (
					<div className="w-full text-center m-4">
						Yapılandırılacak altyapı sağlayıcısı bulunmuyor.
					</div>
				)}
				<Button
					className="w-32 text-lg self-center"
					onClick={handleSave}
				>
					Kaydet
				</Button>
			</div>
		</TempLayout>
	);
}
