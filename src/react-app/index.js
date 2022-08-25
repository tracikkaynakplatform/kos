import React from 'react';
import ReactDOM from 'react-dom/client';
import Clusters from './pages/Clusters';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/main_window" exact element={<Main />} />
			<Route path="/clusters" exact element={<Clusters />} />
		</Routes>
	</BrowserRouter>
);
