import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import ToggleSwitch from "../../ui/ToggleSwitch/ToggleSwitch";
import ImageSelection from "../../ui/ImageSelection/ImageSelection";

import firebase from "../../../firebase/firebase";
import { IUserData, IState } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

import sharedStyles from "../../../shared/styles/auth.module.css";
import styles from "./settings.module.css";

import backgroundLoader from "../../../assets/img/Loading.gif";

interface IProps {
	user?: firebase.User;
	userData?: IUserData;
	isDarkModeEnabled: boolean;
	setIsDarkModeEnabled: (value: boolean) => void;
	setImgFail: (error: string) => void;
	setImg: (userData: IUserData) => Promise<void>;
}

function Settings({
	user,
	userData,
	isDarkModeEnabled,
	setIsDarkModeEnabled,
	setImg,
	setImgFail,
}: IProps) {
	const [imgUrl, setImgUrl] = useState("");
	const [isImgSelectShown, setIsImgSelectShown] = useState(false);

	useEffect(() => {
		if (imgUrl && userData) {
			setImg({ ...userData, photoUrl: imgUrl }).then(() =>
				setTimeout(() => setIsImgSelectShown(false), 500)
			);
		}
	}, [imgUrl]);

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
				{isImgSelectShown ? (
					<ImageSelection
						setImgUrl={setImgUrl}
						setUserDataFail={setImgFail}
					/>
				) : (
					<div
						className={styles.ProfilePic}
						onClick={() => setIsImgSelectShown(true)}
						style={{ backgroundImage: `url(${backgroundLoader})` }}
					>
						<img src={userData.photoUrl} alt="Profile Pic" />
					</div>
				)}
				<div className={styles.Row}>
					<h4 className="text mb-0"> Dark Mode </h4>
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

const mapDispatchToProps = (dispatch: any) => ({
	setIsDarkModeEnabled: (value: boolean) => {
		dispatch(actions.setIsDarkModeEnabled(value));
		window.localStorage.setItem("isDarkModeEnabled", `${value}`);
	},
	setImgFail: (error: string) => dispatch(actions.setImgFail(error)),
	setImg: async (userData: IUserData) => {
		await dispatch(actions.setImg(userData));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
