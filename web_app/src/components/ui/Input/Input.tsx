import React from "react";

import styles from "./input.module.css";

interface IProps {
	onChangeFunc: (param: string) => void;
	placeholder: string;
	val: string;
	type?: "email" | "password" | "text";
	inputType?: "NORMAL" | "TRANSPARENT";
}

export default function Input({
	onChangeFunc,
	placeholder,
	val,
	type,
	inputType,
}: IProps) {
	const onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
		onChangeFunc(e.currentTarget.value);
	};
	switch (inputType) {
		case "TRANSPARENT":
			return (
				<input
					type={type ? type : "text"}
					onChange={onChangeHandler}
					value={val}
					placeholder={placeholder}
					className={styles.InputTransparent}
				/>
			);

		default:
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
}
