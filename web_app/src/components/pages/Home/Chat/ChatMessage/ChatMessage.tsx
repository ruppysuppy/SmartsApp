import React, { useState } from "react";

import Loader from "../../../../ui/Loader/Loader";
import Modal from "../../../../ui/Modal/Modal";

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
	const [isShown, setIsShown] = useState(false);
	const datetime = new Date(timestamp);
	const message = decrypt(text, sharedKey);
	const date = `${datetime.getDate()}/${datetime.getMonth()}/${datetime.getFullYear()}`;
	const time = `${datetime
		.getHours()
		.toString()
		.padStart(2, "0")}:${datetime
		.getMinutes()
		.toString()
		.padStart(2, "0")}`;

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
					<img
						className={styles.MediaMessage}
						src={message}
						alt=""
						onClick={() => setIsShown(true)}
					/>
				</span>
			) : (
				<span className="text-break"> {message} </span>
			)}
			<br />
			<span className={styles.Time}>{time}</span>
			{isMedia && (
				<Modal
					title={`Image`}
					isShown={isShown}
					changeVisibility={setIsShown}
				>
					<img className={styles.ModalPicture} src={message} alt="" />
					<span className={styles.Time}>{`${date} ${time}`}</span>
				</Modal>
			)}
		</div>
	);
}
