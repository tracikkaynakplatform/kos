import {
	Box,
	AppBar,
	Toolbar,
	Typography
} from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Sidebar } from '../components/Sidebar';
import React from 'react';

export default function DashboardLayout(props) {
	return (
		<SnackbarProvider maxSnack={5}>
			<Box sx={{ display: 'flex' }}>
				<AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#023E8A' }} position="fixed">
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Kubernetes Orkestrasyon Sistemi
						</Typography>
					</Toolbar>
				</AppBar>
				<Sidebar />
				<Box id='dsa' sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '90vh' }}>
					<Toolbar /> 
					{props.children}
				</Box>
			</Box>
		</SnackbarProvider>
	);
}
