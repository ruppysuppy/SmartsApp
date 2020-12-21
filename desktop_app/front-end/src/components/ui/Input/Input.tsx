import React from "react";

import styles from "./input.module.css";

interface IProps {
	inputType?: "NORMAL" | "TRANSPARENT";
	placeholder: string;
	type?: "email" | "password" | "text";
	val: string;
	onChangeFunc: (param: string) => void;
}

export default function Input({
	inputType,
	placeholder,
	type,
	val,
	onChangeFunc,
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
