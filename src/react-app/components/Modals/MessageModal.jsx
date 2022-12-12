import React from "react";
import { Button } from "../UI";
import { BaseModal } from "./";

export default function MessageModal({ message, ...props }) {
	return (
		<BaseModal {...props}>
			{message}
			<Button onClick={() => props.closeModal?.()}>Tamam</Button>
		</BaseModal>
	);
}
