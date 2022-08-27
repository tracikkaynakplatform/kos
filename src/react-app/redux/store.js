import { configureStore } from "@reduxjs/toolkit";
import kubeconfig from "./slices/kubeconfig";

export const store = configureStore({
	reducer: {
		kubeconfig
	}
})