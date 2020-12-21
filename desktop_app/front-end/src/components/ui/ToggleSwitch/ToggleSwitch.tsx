import React, { ChangeEvent } from "react";

import styles from "./toggleSwitch.module.css";

interface IProps {
	isEnabled: boolean;
	onUpdate: (state: boolean) => void;
}

export default function ToggleSwitch({ isEnabled, onUpdate }: IProps) {
	const onChangedHandler = (event: ChangeEvent<HTMLInputElement>) => {
		onUpdate(event.target.checked);
	};

	return (
		<label className={styles.Switch}>
			<input
				type="checkbox"
				checked={isEnabled}
				onChange={onChangedHandler}
			/>
			<span className={`${styles.Slider} ${styles.Round}`}></span>
		</label>
	);
}
