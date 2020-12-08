import React from "react";
import { connect } from "react-redux";

import UserInfo from "./UserInfo/UserInfo";

import { IState, IUserData } from "../../../../shared/interfaces/interfaces";

import styles from "./chat.module.css";

interface IProps {
	userData?: IUserData;
}

function Chat({ userData }: IProps) {
	return (
		<div className={styles.Body}>
			<UserInfo userData={userData!} />
			<h1 className="text">Chat</h1>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(Chat);
