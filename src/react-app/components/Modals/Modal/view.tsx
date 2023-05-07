import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "kos-fe/stores/useModalStore";
import { Fragment } from "react";
import { ModalPortal } from "./viewmodel";

export function View() {
	const { content, isOpen, closeModal, persist } = useModalStore();

	return (
		<ModalPortal>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={persist ? () => {} : closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>
					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="select-text w-5/12 transform overflow-hidden rounded-2xl text-black dark:text-white bg-white dark:bg-dark p-6 text-left align-middle shadow-xl transition-all">
									{content}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</ModalPortal>
	);
}
