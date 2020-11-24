import React from "react";

import ChatBackground from "../../../assets/img/Chat.svg";

import styles from "./loading-screen.module.css";

export default function LoadingScreen() {
	return (
		<div className={styles.Body}>
			<div
				className={styles.SplashLoader}
				style={{ backgroundImage: `url(${ChatBackground})` }}
			>
				<div className={styles.Loader} id={styles.Loader1} />
				<div className={styles.Loader} id={styles.Loader2} />
				<div className={styles.Loader} id={styles.Loader3} />
			</div>
		</div>
	);
}
