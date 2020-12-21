import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import ImageSelection from "../../ui/ImageSelection/ImageSelection";
import Loader from "../../ui/Loader/Loader";

import firebase from "../../../firebase/firebase";
import * as actions from "../../../store/actions/actions";
import { IUserData, IState } from "../../../shared/interfaces/interfaces";

import styles from "../../../shared/styles/sharedStyles.module.css";

interface IProps {
	error: string;
	isLoading: boolean;
	user?: firebase.User;
	userData?: IUserData;
	setUserData: (userData: IUserData) => void;
	setUserDataFail: (message: string) => void;
}

function UserDetails({
	error,
	isLoading,
	user,
	userData,
	setUserData,
	setUserDataFail,
}: IProps) {
	const [about, setAbout] = useState("");
	const [imgUrl, setImgUrl] = useState("");
	const [username, setUsername] = useState("");

	useEffect(() => {
		setUserDataFail("");
	}, []);

	if (!user) {
		return <Redirect to="/login" />;
	}
	if (userData) {
		return <Redirect to="/" />;
	}

	const onSubmitHandler = (event: React.FormEvent) => {
		event.preventDefault();
		if (username.trim().length < 4) {
			setUserDataFail("Username must contain at least 4 characters");
			return;
		} else if (username.trim().length > 14) {
			setUserDataFail("Maximum Username length is 14 characters");
			return;
		} else if (username.trim().indexOf(" ") >= 0) {
			setUserDataFail("Username cannot contain spaces");
			return;
		}
		if (about.trim().length === 0) {
			setUserDataFail("About cannot be blank");
			return;
		} else if (about.trim().length > 80) {
			setUserDataFail("Maximum About length is 80 characters");
			return;
		}
		if (imgUrl.length === 0) {
			setUserDataFail("Add a profile picture");
			return;
		}
		setUserData({
			username: username.trim().toLowerCase(),
			uid: user.uid,
			photoUrl: imgUrl,
			about: about,
			publicKey: "",
			privateKey: "",
		});
	};

	return (
		<div className={styles.OverflowContainer}>
			<div className="container mt-5 pt-4 pb-2">
				<h1 className="text">DETAILS</h1>
				<hr className="mt-0" />
				<form className="py-2" onSubmit={onSubmitHandler}>
					<Input
						val={username}
						placeholder="Username"
						onChangeFunc={(value) => setUsername(value)}
					/>
					<Input
						val={about}
						placeholder="About"
						onChangeFunc={(value) => setAbout(value)}
					/>
					<ImageSelection
						setImgUrl={setImgUrl}
						setUserDataFail={setUserDataFail}
					/>
					{error && error !== "User data not found" && (
						<>
							<div className={styles.ErrorText}>
								<i className="fa fa-exclamation-circle d-inline-block pt-1" />
								<span className="d-inline-block pl-1 pb-2 text-wrap">
									{error}
								</span>
							</div>
						</>
					)}
					<span className="d-inline-block mt-2">
						{isLoading ? <Loader /> : <Button>Submit</Button>}
					</span>
				</form>
			</div>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	error: state.auth.error,
	isLoading: state.auth.isLoading,
	user: state.auth.user,
	userData: state.auth.userData,
});

const mapDispatchToProps = (dispatch: any) => ({
	setUserData: (userData: IUserData) =>
		dispatch(actions.setUserData(userData)),
	setUserDataFail: (message: string) =>
		dispatch(actions.setUserDataFail(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
