import React, { createContext, useContext, useState } from "react";

const FormContext = createContext({});
export const useForm = () => useContext(FormContext);

export function FormProvider({ children }) {
	return (
		<FormContext.Provider
			value={{
				values: {},
			}}
		>
			{children}
		</FormContext.Provider>
	);
}
