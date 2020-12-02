import React from "react";

import styles from "./button.module.css";

interface IProps {
	className?: string;
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	btnType?: "NORMAL" | "SECONDARY";
}

export default function Button({
	children,
	className,
	btnType,
	...props
}: IProps) {
	if (!btnType) {
		btnType = "NORMAL";
	}

	return (
		<button
			className={`${styles.Btn} ${btnType == "NORMAL" && styles.Normal} ${
				btnType == "SECONDARY" && styles.Secondary
			} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
