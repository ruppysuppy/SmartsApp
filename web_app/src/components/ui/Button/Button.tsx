import React from "react";

import styles from "./button.module.css";

interface IProps {
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, ...props }: IProps) {
	return (
		<button className={styles.Btn} {...props}>
			{children}
		</button>
	);
}
