import { createContext, useContext, useState } from "react";
import { ReversibleLayoutContextType, ReversibleLayoutProviderProps } from "./types";

const ReversibleLayoutContext = createContext<ReversibleLayoutContextType | any>({});
export const useReversibleLayout = () => useContext(ReversibleLayoutContext) as ReversibleLayoutContextType;

export function ReversibleLayoutProvider(props: ReversibleLayoutProviderProps) {
	const [isBackEnabled, setIsBackEnabled] = useState<boolean>(true);
	let onBackClick = null;

	return (
		<ReversibleLayoutContext.Provider
			value={{
				isBackEnabled,
				enableBack: () => setIsBackEnabled(true),
				disableBack: () => setIsBackEnabled(false),
				setOnBackClick: (handler: () => void) => {
					onBackClick = handler;
				},
				onBackClick,
			}}
		>
			{props.children}
		</ReversibleLayoutContext.Provider>
	);
}
