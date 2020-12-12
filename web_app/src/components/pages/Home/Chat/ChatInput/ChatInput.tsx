import React, { useState } from "react";

import Input from "../../../../ui/Input/Input";

import styles from "./chatInput.module.css";

export default function ChatInput() {
	const [message, setMessage] = useState("");

	return (
		<div className={styles.Body}>
			<div className={styles.InputContainer}>
				<Input
					onChangeFunc={setMessage}
					val={message}
					placeholder="Type your message"
				/>
			</div>
			<span className={styles.Btn}>
				<i className="fa fa-paperclip" aria-hidden="true" />
			</span>
			<span className={`${styles.Btn} ${styles.BtnPrimary}`}>
				<i className="fa fa-paper-plane" aria-hidden="true" />
			</span>
		</div>
	);
}
