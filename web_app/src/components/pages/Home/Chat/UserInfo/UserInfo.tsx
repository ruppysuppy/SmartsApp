import React from "react";

import { IUserData } from "../../../../../shared/interfaces/interfaces";

import styles from "./userInfo.module.css";

interface IProps {
	userData: IUserData;
}

export default function UserInfo({ userData }: IProps) {
	return (
		<>
			<div className={`mt-5 ${styles.Body}`}>
				<i className="material-icons mr-3 fs-6 text">
					keyboard_backspace
				</i>
				<div className={styles.UserDetails}>
					<div className={`mr-2 ${styles.ProfilePicure}`}>
						<img src={userData.photoUrl} alt=" " />
					</div>
					<span className="text fw-bold fs-6">
						{userData.username}
					</span>
				</div>
			</div>
		</>
	);
}
