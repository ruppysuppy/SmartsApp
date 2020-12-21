import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import ImageSelection from "../../ui/ImageSelection/ImageSelection";
import ToggleSwitch from "../../ui/ToggleSwitch/ToggleSwitch";
import UpdateAboutInput from "./UpdateAboutInput/UpdateAboutInput";

import firebase from "../../../firebase/firebase";
import { IState, IUserData } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

import sharedStyles from "../../../shared/styles/sharedStyles.module.css";
import styles from "./settings.module.css";

import backgroundLoader from "../../../assets/img/Loading.gif";

interface IProps {
	isDarkModeEnabled: boolean;
	user?: firebase.User;
	userData?: IUserData;
	setImg: (userData: IUserData) => Promise<void>;
	setImgFail: (error: string) => void;
	setIsDarkModeEnabled: (value: boolean) => void;
}

function Settings({
	isDarkModeEnabled,
	user,
	userData,
	setImg,
	setImgFail,
	setIsDarkModeEnabled,
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
				<UpdateAboutInput />
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
	isDarkModeEnabled: state.ui.isDarkModeEnabled,
	user: state.auth.user,
	userData: state.auth.userData,
});

const mapDispatchToProps = (dispatch: any) => ({
	setImg: async (userData: IUserData) => {
		await dispatch(actions.setImg(userData));
	},
	setImgFail: (error: string) => dispatch(actions.setImgFail(error)),
	setIsDarkModeEnabled: (value: boolean) => {
		dispatch(actions.setIsDarkModeEnabled(value));
		window.localStorage.setItem("isDarkModeEnabled", `${value}`);
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
