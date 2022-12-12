import React, { createContext, useContext } from "react";

const LayoutContext = createContext({});
export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ value, children }) {
	return (
		<LayoutContext.Provider value={value}>
			{children}
		</LayoutContext.Provider>
	);
}
