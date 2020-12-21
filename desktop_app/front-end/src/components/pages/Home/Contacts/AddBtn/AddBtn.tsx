import React, { useState } from "react";
import { connect } from "react-redux";

import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import Loader from "../../../../ui/Loader/Loader";
import Modal from "../../../../ui/Modal/Modal";

import {
	IContactData,
	IState,
	IUserData,
} from "../../../../../shared/interfaces/interfaces";
import * as actions from "../../../../../store/actions/actions";

import styles from "./addBtn.module.css";
import sharedStyles from "../../../../../shared/styles/sharedStyles.module.css";

interface IProps {
	error: string;
	contacts: IContactData[];
	isLoading: boolean;
	userData?: IUserData;
	addContact: (userId: string, username: string) => Promise<void>;
	addContactFail: (error: string) => void;
	getContacts: (uid: string, privateKey: string) => void;
}

function AddBtn({
	error,
	contacts,
	isLoading,
	userData,
	addContact,
	addContactFail,
	getContacts,
}: IProps) {
	const [username, setUsername] = useState("");
	const [isShown, setIsShown] = useState(false);

	const onSubmitHandler = async () => {
		if (
			username.trim().length < 4 ||
			username.trim().length > 14 ||
			username.trim().indexOf(" ") >= 0
		) {
			addContactFail("Enter a valid username");
			return;
		}
		if (username === userData!.username) {
			addContactFail("You cannot add yourself to your contact");
			return;
		}
		if (userData!.uid) {
			await addContact(userData!.uid, username.trim().toLowerCase());
			if (error === "") {
				setIsShown(false);
				setUsername("");
				if (contacts.length === 0) {
					getContacts(userData!.uid, userData!.privateKey);
				}
			}
		}
	};

	return (
		<>
			<div
				className={styles.Btn}
				id="add-contacts-btn"
				onClick={() => setIsShown(true)}
			>
				<i className="material-icons">group_add</i>
			</div>
			<Modal
				title="Add User To Contacts"
				isShown={isShown}
				changeVisibility={(value: boolean) => setIsShown(value)}
			>
				<div className={styles.InputHolder}>
					<Input
						placeholder="username"
						val={username}
						onChangeFunc={(param: string) => setUsername(param)}
					/>
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
				{isLoading ? (
					<Loader />
				) : (
					<Button btnType="NORMAL" onClick={onSubmitHandler}>
						Add Contact
					</Button>
				)}
			</Modal>
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	error: state.contact.newUserError,
	contacts: state.contact.contacts,
	isLoading: state.contact.isNewUserLoading,
	userData: state.auth.userData,
});

const mapDispatchToProps = (dispatch: any) => ({
	addContact: async (userId: string, username: string) =>
		await dispatch(actions.addContact(userId, username)),
	addContactFail: (error: string) => dispatch(actions.addContactFail(error)),
	getContacts: (uid: string, privateKey: string) =>
		dispatch(actions.getContacts(uid, privateKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBtn);
