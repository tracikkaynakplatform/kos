import {
	Typography,
	TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from "react";
import { translate } from "../../locales";
import React from 'react';
import Wrapper from './Wrapper';
import { Monitor } from '../PieChart';

export default function StepKubeConfig(props) {
	const [kubeConfig, setKubeConfig] = useState('');
	const [textFieldEnabled, setTextFieldEnabled] = useState(true);
	const [buttonsEnabled, setButtonsEnabled] = useState(true);
	const snack = useSnackbar().enqueueSnackbar;
	const closeSnack = useSnackbar().closeSnackbar;
	const _next = props.nextStep;
	const _back = props.previousStep;

	useEffect(() => {
		(async () => {
			setKubeConfig(await window.kubeConfig.loadFromDefault());
		})();
	}, []);

	return (
		<Wrapper
			disableBack={!buttonsEnabled}
			disableNext={!buttonsEnabled}
			onNextClick={async () => {
				setTextFieldEnabled(false);
				setButtonsEnabled(false);
				snack('kubectl çalıştırılıyor...', { variant: 'info', autoHideDuration: 2000 });
				try {
					if (!(await window.kubectl.check())) {
						const downloadSnack = snack('kubectl bulunamadı! İndirme işlemi başlatılıyor...', { variant: 'info', persist: true });
						// TODO: snackbar yükleniyor tasarımında olacak.
						if (!(await window.kubectl.download()));
						{
							closeSnack(downloadSnack);
							throw new Error('kubectl indirme işlemi başarısız!');
						}
						closeSnack(downloadSnack);
					}

					if (!(await window.kubectl.get('namespace', kubeConfig)))
						throw new Error('Küme ile bağlantı kurulamadı!');
					snack('Küme ile bağlantı sağlandı', { variant: 'success', autoHideDuration: 2000 });
					_next();
				}
				catch (err) {
					snack(err.message, { variant: 'error', autoHideDuration: 2000 });
				}
				setTextFieldEnabled(true);
				setButtonsEnabled(true);
			}}
			onBackClick={() => {
				_back();
			}}>
			<Typography sx={{
				fontSize: '20px',
				fontWeight: 'bold',
				pb: 2,
				pt: 2
			}}>
				Yönetim kümesinin bilgileri
			</Typography>
			<Typography>
				Yeni küme oluşturmak için kullanılacak yönetim kümesine ait olan kube config bilgilerini girin.<br />(Varsayılan olarak sistemdeki ~/.kube/config dosya içeriği alınmıştır)
			</Typography>
			<TextField disabled={!textFieldEnabled} onChange={(e) => setKubeConfig(e.target.value)} value={kubeConfig} sx={{ mt: 2, mb: 2, width: '700px' }} label={translate('kubeConfigContent')} multiline rows={15} />
		</Wrapper>
	);
}
