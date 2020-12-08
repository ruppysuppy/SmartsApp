import React from "react";

import { IUserData } from "../../../../../shared/interfaces/interfaces";

import styles from "./contactCard.module.css";

import Loader from "../../../../../assets/img/Loading.gif";

interface IProps {
	userData: IUserData;
}

export default function ContactCard({ userData }: IProps) {
	return (
		<div className={styles.Body}>
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
