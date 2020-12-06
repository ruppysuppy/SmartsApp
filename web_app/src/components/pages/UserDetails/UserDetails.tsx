import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import Loader from "../../ui/Loader/Loader";
import ImageSelection from "../../ui/ImageSelection/ImageSelection";

import firebase from "../../../firebase/firebase";
import * as actions from "../../../store/actions/actions";
import { IUserData, IState } from "../../../shared/interfaces/interfaces";

import styles from "../../../shared/styles/auth.module.css";

interface IProps {
	user?: firebase.User;
	userData?: IUserData;
	error: string;
	isLoading: boolean;
	setUserData: (userData: IUserData) => void;
	setUserDataFail: (message: string) => void;
}

function UserDetails({
	user,
	userData,
	error,
	isLoading,
	setUserData,
	setUserDataFail,
}: IProps) {
	const [username, setUsername] = useState("");
	const [about, setAbout] = useState("");
	const [imgUrl, setImgUrl] = useState("");

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
		if (username.length === 0) {
			setUserDataFail("Username field is mandatory");
			return;
		}
		if (about.length === 0) {
			setUserDataFail("About field is mandatory");
			return;
		}
		if (imgUrl.length === 0) {
			setUserDataFail("Add a profile picture");
			return;
		}
		setUserData({
			username: username,
			uid: user.uid,
			photoUrl: imgUrl,
			about: about,
			publicKey: "",
		});
		// `https://avatars.dicebear.com/api/human/${Math.floor(
		// 	Math.random() * 250
		// 	)}.svg`
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
						uid={user.uid}
					/>
					{error && error !== "User data not found" && (
						<>
							<div className={styles.ErrorText}>
								<i className="material-icons">error_outline</i>
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
	user: state.auth.user,
	userData: state.auth.userData,
	error: state.auth.error,
	isLoading: state.auth.isLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
	setUserData: (userData: IUserData) =>
		dispatch(actions.setUserData(userData)),
	setUserDataFail: (message: string) =>
		dispatch(actions.setUserDataFail(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
