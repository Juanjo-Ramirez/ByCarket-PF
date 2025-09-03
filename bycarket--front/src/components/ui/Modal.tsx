"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		const handleClickOutside = (e: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.addEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "auto";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4'>
			<div
				ref={modalRef}
				className='bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto'>
				<div className='flex justify-between items-center border-b p-4'>
					<h3 className='text-lg font-semibold text-gray-800'>
						{title}
					</h3>
					<button
						onClick={onClose}
						className='text-gray-500 hover:text-gray-700 transition-colors'>
						<X className='h-5 w-5' />
					</button>
				</div>
				<div className='p-4'>{children}</div>
			</div>
		</div>
	);
};
