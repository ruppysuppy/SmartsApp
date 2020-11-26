import React from "react";

import BackgroundImg from "../../../assets/img/Background.svg";
import ChatHover from "../../../assets/img/ChatHover.svg";
import styles from "./authbackground.module.css";

interface Props {
	children?: React.ReactNode;
}

export default function AuthBackground({ children }: Props) {
	return (
		<div
			className={styles.Body}
			style={{ backgroundImage: `url(${BackgroundImg})` }}
		>
			<img className={styles.ChatHover} src={ChatHover} />
			<div className={styles.AuthFormCard}>
				<div className="container"> {children} </div>
			</div>
		</div>
	);
}
