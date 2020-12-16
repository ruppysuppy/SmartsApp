import React from "react";

import Loader from "../../../../ui/Loader/Loader";

import { decrypt } from "../../../../../cryptography/cipher";

import styles from "./chatMessage.module.css";

interface IProps {
	isMedia?: boolean;
	isUserSent: boolean;
	sharedKey: string;
	text: string;
	timestamp: number;
	refCallBack?: (node: any) => void;
}

export default function ChatMessage({
	isMedia,
	isUserSent,
	sharedKey,
	text,
	timestamp,
	refCallBack,
}: IProps) {
	const date = new Date(timestamp);
	const message = decrypt(text, sharedKey);

	return (
		<div
			className={`text ${styles.Body} ${
				isUserSent ? styles.Sent : styles.Received
			}`}
			ref={refCallBack}
		>
			{isMedia ? (
				<span className={styles.MediaHolder}>
					<span className={styles.LoaderHolder}>
						<Loader />
					</span>
					<img className={styles.MediaMessage} src={message} alt="" />
				</span>
			) : (
				<span className="text-break"> {message} </span>
			)}
			<br />
			<span
				className={styles.Time}
			>{`${date
				.getHours()
				.toString()
				.padStart(2, "0")}:${date
				.getMinutes()
				.toString()
				.padStart(2, "0")}`}</span>
		</div>
	);
}
