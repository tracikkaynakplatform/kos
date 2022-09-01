import { Typography, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { translate } from "../../locales";
import React from "react";
import Wrapper from "./Wrapper";
import { useWizard } from ".";

export default function StepKubeConfig(props) {
	const [kubeConfig, setKubeconfig] = useState("");
	const wizard = useWizard();
	const [textFieldEnabled, setTextFieldEnabled] = useState(true);
	const [buttonsEnabled, setButtonsEnabled] = useState(true);
	const snack = useSnackbar().enqueueSnackbar;
	const closeSnack = useSnackbar().closeSnackbar;
	const _next = props.nextStep;
	const _back = props.previousStep;

	useEffect(() => {
		(async () => {
			setKubeconfig(await window.kubeConfig.loadFromDefault());
		})();
	}, []);

	return (
		<Wrapper
			disableBack={!buttonsEnabled}
			disableNext={!buttonsEnabled}
			onNextClick={async () => {
				setTextFieldEnabled(false);
				setButtonsEnabled(false);
				try {
					if (!(await window.kubectl.check())) {
						const downloadSnack = snack(
							"kubectl bulunamadı! İndiriliyor...",
							{ variant: "info", persist: true }
						);
						// TODO: snackbar yükleniyor tasarımında olacak.
						const isDownloaded = await window.kubectl.download();
						if (!isDownloaded) {
							closeSnack(downloadSnack);
							throw new Error(
								"kubectl indirme işlemi başarısız!"
							);
						}
						closeSnack(downloadSnack);
					}

					snack("kubectl çalıştırılıyor...", {
						variant: "info",
						autoHideDuration: 2000,
					});
					if (!(await window.kubectl.get("namespace", kubeConfig)))
						throw new Error("Küme ile bağlantı kurulamadı!");
					snack("Küme ile bağlantı sağlandı", {
						variant: "success",
						autoHideDuration: 2000,
					});
					wizard.setData({
						...wizard.data,
						config: kubeConfig,
					});
					_next();
				} catch (err) {
					snack(err.message, {
						variant: "error",
						autoHideDuration: 2000,
					});
				}
				setTextFieldEnabled(true);
				setButtonsEnabled(true);
			}}
			onBackClick={() => {
				_back();
			}}
		>
			<Typography
				sx={{
					fontSize: "20px",
					fontWeight: "bold",
					pb: 2,
					pt: 2,
				}}
			>
				Yönetim kümesinin bilgileri
			</Typography>
			<Typography>
				Yeni küme oluşturmak için kullanılacak yönetim kümesine ait olan
				kube config bilgilerini girin.
				<br />
				(Varsayılan olarak sistemdeki ~/.kube/config dosya içeriği
				alınmıştır)
			</Typography>
			<TextField
				disabled={!textFieldEnabled}
				onChange={(e) => setKubeconfig(e.target.value)}
				value={kubeConfig}
				sx={{ mt: 2, mb: 2, width: "700px" }}
				label={translate("kubeConfigContent")}
				multiline
				rows={15}
			/>
		</Wrapper>
	);
}
