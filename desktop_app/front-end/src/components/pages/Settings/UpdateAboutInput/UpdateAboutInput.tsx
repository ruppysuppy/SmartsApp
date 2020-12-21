import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Button from "../../../ui/Button/Button";
import Input from "../../../ui/Input/Input";
import Loader from "../../../ui/Loader/Loader";

import { IState, IUserData } from "../../../../shared/interfaces/interfaces";
import * as actions from "../../../../store/actions/actions";

import sharedStyles from "../../../../shared/styles/sharedStyles.module.css";
import styles from "./updateAboutInput.module.css";

interface IProps {
	error: string;
	isLoading: boolean;
	userData?: IUserData;
	updateAbout: (userData: IUserData) => Promise<void>;
	updateAboutFail: (message: string) => void;
}

function UpdateAboutInput({
	error,
	isLoading,
	userData,
	updateAbout,
	updateAboutFail,
}: IProps) {
	const [about, setAbout] = useState("");
	const [aboutModified, setAboutModified] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		if (userData) {
			setAbout(userData.about);
		}
	}, []);
	useEffect(() => {
		if (userData) {
			setAboutModified(about !== userData.about);
			setIsSuccess(false);
		}
	}, [about]);

	const onSubmitHandler = async () => {
		if (userData) {
			if (about.trim().length === 0) {
				updateAboutFail("About cannot be blank");
				return;
			} else if (about.trim().length > 80) {
				updateAboutFail("Maximum About length is 80 characters");
				return;
			}
			const userDataCopy = { ...userData, about: about };
			await updateAbout(userDataCopy);
			setIsSuccess(true);
			setTimeout(() => {
				setAboutModified(false);
				setIsSuccess(false);
			}, 500);
		}
	};

	return (
		<>
			<div className={styles.AboutHolder}>
				<div className={styles.InputHolder}>
					<Input
						placeholder="About"
						val={about}
						onChangeFunc={setAbout}
					/>
				</div>
				{aboutModified && (
					<div className={styles.BtnHolder}>
						{isSuccess ? (
							<i
								className={`material-icons ${styles.Tick}`}
								aria-hidden="true"
							>
								done
							</i>
						) : isLoading ? (
							<Loader />
						) : (
							<Button onClick={onSubmitHandler}>Update</Button>
						)}
					</div>
				)}
			</div>
			{error && (
				<>
					<div className={sharedStyles.ErrorText}>
						<i className="fa fa-exclamation-circle d-inline-block pt-1" />
						<span className="d-inline-block pl-1 pb-2 text-wrap">
							{error}
						</span>
					</div>
				</>
			)}
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	error: state.auth.error,
	isLoading: state.auth.isLoading,
	userData: state.auth.userData,
});

const mapDispatchToProps = (dispatch: any) => ({
	updateAbout: async (userData: IUserData) => {
		await dispatch(actions.setAbout(userData));
	},
	updateAboutFail: (message: string) =>
		dispatch(actions.setAboutFail(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAboutInput);
