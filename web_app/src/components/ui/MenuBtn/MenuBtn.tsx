import React from "react";

import styles from "./menuBtn.module.css";

interface IProps {
	isCross: boolean;
	onClick: () => void;
}

export default function MenuBtn({ isCross, onClick }: IProps) {
	return (
		<button className={styles.Toggler} onClick={onClick}>
			<div className={`${styles.Bar1} ${isCross && styles.CrossBar1}`} />
			<div className={`${styles.Bar2} ${isCross && styles.CrossBar2}`} />
			<div className={`${styles.Bar3} ${isCross && styles.CrossBar3}`} />
		</button>
	);
}
