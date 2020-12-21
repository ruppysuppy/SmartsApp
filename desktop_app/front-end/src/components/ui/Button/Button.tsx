import React from "react";

import styles from "./button.module.css";

interface IProps {
	btnType?: "NORMAL" | "SECONDARY";
	children?: React.ReactNode;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
	btnType,
	children,
	className,
	...props
}: IProps) {
	if (!btnType) {
		btnType = "NORMAL";
	}

	return (
		<button
			className={`${styles.Btn} ${
				btnType === "NORMAL" && styles.Normal
			} ${btnType === "SECONDARY" && styles.Secondary} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
