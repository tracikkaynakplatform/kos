import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext({});
export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
	const [modal, setModal] = useState(null);
	const closeModal = () => setModal(null);
	const showModal = (Modal, modalProps, onClose, children) => {
		setModal(
			<Modal open={true} onClose={onClose} {...(modalProps ?? {})}>
				{children}
			</Modal>
		);
	};

	return (
		<ModalContext.Provider
			value={{
				showModal,
				closeModal,
			}}
		>
			{children}
			{modal}
		</ModalContext.Provider>
	);
}
