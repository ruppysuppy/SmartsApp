import React from "react";

import { decrypt } from "../../../../../cryptography/cipher";
import Loader from "../../../../ui/Loader/Loader";

import styles from "./chatMessage.module.css";

interface IProps {
	isUserSent: boolean;
	text: string;
	sharedKey: string;
	timestamp: number;
	reference?: (node: any) => void;
	isMedia?: boolean;
}

export default function ChatMessage({
	isUserSent,
	text,
	sharedKey,
	timestamp,
	reference,
	isMedia,
}: IProps) {
	const date = new Date(timestamp);
	const message = decrypt(text, sharedKey);

	return (
		<div
			className={`text ${styles.Body} ${
				isUserSent ? styles.Sent : styles.Received
			}`}
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
			{reference === undefined ? (
				<span
					className={styles.Time}
				>{`${date
					.getHours()
					.toString()
					.padStart(2, "0")}:${date
					.getMinutes()
					.toString()
					.padStart(2, "0")}`}</span>
			) : (
				<span
					ref={reference}
					className={styles.Time}
				>{`${date
					.getHours()
					.toString()
					.padStart(2, "0")}:${date
					.getMinutes()
					.toString()
					.padStart(2, "0")}`}</span>
			)}
		</div>
	);
}
