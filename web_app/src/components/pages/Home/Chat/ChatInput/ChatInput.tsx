import React, { useState } from "react";
import { connect } from "react-redux";

import Input from "../../../../ui/Input/Input";

import * as actions from "../../../../../store/actions/actions";

import styles from "./chatInput.module.css";
import {
	IContactData,
	IState,
	IUserData,
} from "../../../../../shared/interfaces/interfaces";

interface IProps {
	sendMessage: (
		uid: string,
		otherId: string,
		message: string,
		sharedKey: string
	) => Promise<void>;
	userData?: IUserData;
	contacts: IContactData[];
	selectedContact?: number;
	error: string;
}

function ChatInput({
	userData,
	selectedContact,
	contacts,
	error,
	sendMessage,
}: IProps) {
	const [message, setMessage] = useState("");

	const onSubmitHandler = async () => {
		if (!message) {
			return;
		}
		await sendMessage(
			userData!.uid,
			contacts[selectedContact!].uid,
			message,
			contacts[selectedContact!].sharedKey
		);
		if (!error) {
			setMessage("");
		}
	};

	return (
		<div className={styles.Body}>
			<div className={styles.InputContainer}>
				<Input
					onChangeFunc={setMessage}
					val={message}
					placeholder="Type your message"
				/>
			</div>
			<span className={styles.Btn}>
				<i className="fa fa-paperclip" aria-hidden="true" />
			</span>
			<span
				className={`${styles.Btn} ${styles.BtnPrimary}`}
				onClick={onSubmitHandler}
			>
				<i className="fa fa-paper-plane" aria-hidden="true" />
			</span>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	userData: state.auth.userData,
	contacts: state.contact.contacts,
	selectedContact: state.contact.selectedContact,
	error: state.contact.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	sendMessage: async (
		uid: string,
		otherId: string,
		message: string,
		sharedKey: string
	) => await dispatch(actions.sendMessage(uid, otherId, message, sharedKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
