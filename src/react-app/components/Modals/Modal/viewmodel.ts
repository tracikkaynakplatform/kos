import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ModalPortalProps = {
	children: ReactNode;
};

export function ModalPortal({ children }: ModalPortalProps) {
	const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const root = document.getElementById("modal-root");
		setModalRoot(root);
	}, []);

	if (!modalRoot) {
		return null;
	}

	return createPortal(children, modalRoot);
}
