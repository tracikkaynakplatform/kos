import { Box } from '@mui/material';
import React from 'react';
import StepWizard from "react-step-wizard";
import StepOperation from './StepOperation';
import StepKubeConfig from './StepKubeConfig';
import StepSelectProvider from './StepSelectProvider';
import StepKindProviderConfig from './StepKindProviderConfig';
import StepDigitalOceanSSHkey from './StepDigitalOceanSSHkey';
import StepDigitalOceanClusterConfig from './StepDigitalOceanClusterConfig';

export default function CreateClusterWizard(props) {
	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100%'
		}}>
			<StepWizard transitions={{}}>
				<StepOperation />
				<StepKubeConfig />
				<StepSelectProvider stepName='selectProvider' />
				<StepKindProviderConfig stepName='kind' />
				<StepDigitalOceanSSHkey stepName='digitalocean' />
				<StepDigitalOceanClusterConfig stepName='digitalocean-clusterconfig' />
			</StepWizard>
		</Box>
	);
}