import React, { useEffect, useState } from "react";
import {
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { translate } from "../../locales";
import { useWizard } from "../../hooks/useWizard";
import { PROVIDER_TYPE } from "../../../main/providers";
import Wrapper from "../StepWizardWrapper";
import clusterConfig from "../../api/clusterConfig";
import kubeConfig from "../../api/kubeConfig";

export default function StepSelectProvider({ goToNamedStep, ...props }) {
	const snack = useSnackbar().enqueueSnackbar;
	const [providers, setProviders] = useState([]);
	const [provider, setProvider] = useState("");
	const wizard = useWizard();
	const _goto = goToNamedStep;

	return (
		<Wrapper
			onLoad={async () => {
				let config = await kubeConfig.loadManagementConfig(
					props.manClusterName
				);
				await wizard.updateData("config", config);
				let supportedProviders =
					await clusterConfig.getSupportedProviders(config);
				setProviders(
					supportedProviders.map((p) => {
						switch (p) {
							case PROVIDER_TYPE.DOCKER:
								return {
									key: "kindProviderConfig",
									name: "Kind - Docker",
								};
							case PROVIDER_TYPE.DIGITAL_OCEAN:
								return {
									key: "digitalOceanSSHkey",
									name: "DigitalOcean",
								};
							case PROVIDER_TYPE.AWS:
								return {
									key: "AWSProviderConfig",
									name: "AWS - Amazon Web Services",
								};
						}
					})
				);
			}}
			onNextClick={() => {
				if (!!provider) {
					_goto(provider);
					return;
				}
				snack(translate("errSelectOperation"), {
					variant: "error",
					autoHideDuration: 2000,
				});
			}}
			disableBack
			{...props}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Altyapı sağlayıcısı seçin
			</Typography>
			<Typography>
				Oluşturulacak kümenin hangi altyapı sağlayıcısı kullanılarak
				oluşturulacağını seçin.
				<br />
				Bu altyapı yönetim kümenizin oluşturulmasında kullanılan altyapı
				ile aynı olmalıdır.
			</Typography>
			<Box
				sx={{
					mt: "10px",
					mb: "10px",
				}}
			>
				<FormControl fullWidth>
					<InputLabel>{translate("provider")}</InputLabel>
					<Select
						value={provider}
						label={translate("provider")}
						onChange={(e) => setProvider(e.target.value)}
					>
						{providers.map((x, i) => (
							<MenuItem value={x.key} key={i}>
								{x.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
		</Wrapper>
	);
}
