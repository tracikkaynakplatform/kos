import { useModalStore } from "kos-fe/stores/useModalStore";

export type MessageModalProps = {
	message: string;
	title?: string;
};

export function View(props: MessageModalProps) {
	const { closeModal } = useModalStore();

	return (
		<div className="flex flex-col gap-5">
			{!!props.title && <div className="font-bold text-xl">{props.title}</div>}
			<div className="p-2">{props.message}</div>
			<button className="w-20 self-end" onClick={closeModal}>
				OK
			</button>
		</div>
	);
}
