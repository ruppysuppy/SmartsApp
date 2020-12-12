import React from "react";

import { IContactData } from "../../../../../shared/interfaces/interfaces";

import styles from "./contactCard.module.css";

import Loader from "../../../../../assets/img/Loading.gif";

interface IProps {
	userData: IContactData;
	onClickHandler: () => void;
}

export default function ContactCard({ userData, onClickHandler }: IProps) {
	return (
		<div className={styles.Body} onClick={onClickHandler}>
			<div
				className={styles.ProfilePic}
				style={{ backgroundImage: `url(${Loader})` }}
			>
				<img src={userData.photoUrl} alt=" " />
			</div>
			<div className={styles.InfoContainer}>
				<div className="text fs-5 fw-bold">{userData.username}</div>
				<div className="text text-secondary fs-6">Last Message...</div>
			</div>
		</div>
	);
}
