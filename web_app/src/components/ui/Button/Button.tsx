import React from "react";

import styles from "./button.module.css";

interface Props {
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, ...props }: Props) {
	return (
		<button className={styles.Btn} {...props}>
			{children}
		</button>
	);
}
