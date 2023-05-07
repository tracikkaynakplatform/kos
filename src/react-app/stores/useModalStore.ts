import React from "react";
import { create } from "zustand";

type ModalState = {
	isOpen: boolean;
	content: React.ReactNode | null;
	openModal: (content: React.ReactNode, persist?: boolean) => void;
	closeModal: () => void;
	persist?: boolean;
};

export const useModalStore = create<ModalState>((set) => ({
	isOpen: false,
	content: null,
	openModal: (content, persist = false) => set(() => ({ isOpen: true, content, persist })),
	closeModal: () => set(() => ({ isOpen: false })),
	persist: false,
}));
