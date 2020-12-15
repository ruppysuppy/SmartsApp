import React from "react";

import Loader from "../../../../../assets/img/Loading.gif";

import { IContactData } from "../../../../../shared/interfaces/interfaces";
import { decrypt } from "../../../../../cryptography/cipher";

import styles from "./contactCard.module.css";

interface IProps {
	userData: IContactData;
	onClickHandler: () => void;
}

export default function ContactCard({ userData, onClickHandler }: IProps) {
	const lastMessage =
		userData.messages.length > 0
			? decrypt(
					userData.messages[userData.messages.length - 1].text,
					userData.sharedKey
			  )
			: "No message exchanged";

	const currDate =
		userData.messages.length > 0
			? new Date(
					userData.messages[userData.messages.length - 1].timestamp
			  )
			: "";
	const currDateString =
		currDate === ""
			? ""
			: `${currDate.getDate()}/${currDate.getMonth()}/${currDate.getFullYear()}`;

	return (
		<div className={styles.Body} onClick={onClickHandler}>
			<div
				className={styles.ProfilePic}
				style={{ backgroundImage: `url(${Loader})` }}
			>
				<img src={userData.photoUrl} alt=" " />
			</div>
			<div className={styles.InfoContainer}>
				<div className={styles.FlexContainer}>
					<div className={styles.FlexContainer}>
						<div className="text fs-5 fw-bold">
							{userData.username}
						</div>
					</div>
					<div className="text-muted">{currDateString}</div>
				</div>
				<div className={styles.FlexContainer}>
					<div className={styles.FlexContainer}>
						<div className="text-muted fs-6">
							{lastMessage.length > 30
								? lastMessage.slice(0, 30) + "....."
								: lastMessage}
						</div>
					</div>
					{userData.newMessages > 0 && (
						<span className={styles.NewMessageCount}>
							{userData.newMessages >= 10
								? "9+"
								: userData.newMessages}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
