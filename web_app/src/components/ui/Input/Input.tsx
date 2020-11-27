import React from "react";

import styles from "./input.module.css";

interface IProps {
	onChangeFunc: (param: string) => void;
	placeholder: string;
	val: string;
	type?: "email" | "password" | "text";
}

export default function Input({
	onChangeFunc,
	placeholder,
	val,
	type,
}: IProps) {
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
