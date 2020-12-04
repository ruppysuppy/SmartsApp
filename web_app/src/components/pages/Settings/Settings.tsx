import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";

import ToggleSwitch from "../../ui/ToggleSwitch/ToggleSwitch";

import firebase from "../../../firebase/firebase";
import { IUserData, IState } from "../../../shared/interfaces/Interfaces";
import * as actions from "../../../store/actions/actions";

import sharedStyles from "../../../shared/styles/auth.module.css";
import styles from "./settings.module.css";

interface IProps {
	user?: firebase.User;
	userData?: IUserData;
	isDarkModeEnabled: boolean;
	setIsDarkModeEnabled: (value: boolean) => void;
}

function Settings({
	user,
	userData,
	isDarkModeEnabled,
	setIsDarkModeEnabled,
}: IProps) {
	if (!user) {
		return <Redirect to="/login" />;
	}
	if (!userData) {
		return <Redirect to="/user-details" />;
	}

	return (
		<div className={sharedStyles.OverflowContainer}>
			<div className="container mt-5 pt-4 pb-2">
				<h1 className="text">Settings</h1>
				<hr />
				<div className={styles.Row}>
					<h4 className="text"> Dark Mode </h4>
					<ToggleSwitch
						isEnabled={isDarkModeEnabled}
						onUpdate={setIsDarkModeEnabled}
					/>
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	user: state.auth.user,
	userData: state.auth.userData,
	isDarkModeEnabled: state.ui.isDarkModeEnabled,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	setIsDarkModeEnabled: (value: boolean) =>
		dispatch(actions.setIsDarkModeEnabled(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
