import React from "react";

import styles from "./input.module.css";

interface Props {
	onChangeFunc: (param: string) => void;
	placeholder: string;
	val: string;
	type?: "text" | "password";
}

export default function Input({ onChangeFunc, placeholder, val, type }: Props) {
	const onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
		onChangeFunc(e.currentTarget.value);
	};

	return (
		<input
			type={type ? type : "text"}
			onChange={onChangeHandler}
			value={val}
			placeholder={placeholder}
			className={styles.Input}
		/>
	);
}
