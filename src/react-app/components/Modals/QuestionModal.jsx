import React from "react";
import { Button, BUTTON_COLOR } from "../UI/Button";
import BaseModal from "./BaseModal";

export default function QuestionModal({
	message,
	yesButtonText,
	noButtonText,
	yesButtonColor,
	noButtonColor,
	onYesClick,
	onNoClick,
	...props
}) {
	return (
		<BaseModal {...props}>
			<div className="text-xl">{message}</div>
			<div className="flex w-full justify-end gap-5">
				<Button className="w-20" onClick={onYesClick}>
					{yesButtonText ?? "Tamam"}
				</Button>
				<Button
					color={BUTTON_COLOR.error}
					className="w-20"
					onClick={onNoClick}
				>
					{noButtonText ?? "İptal"}
				</Button>
			</div>
		</BaseModal>
	);
}
