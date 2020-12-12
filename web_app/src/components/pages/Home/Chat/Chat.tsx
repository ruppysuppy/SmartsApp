import React from "react";
import { connect } from "react-redux";

import UserInfo from "./UserInfo/UserInfo";
import ChatInput from "./ChatInput/ChatInput";

import { IContactData, IState } from "../../../../shared/interfaces/interfaces";
import { decrypt } from "../../../../cryptography/cipher";

import styles from "./chat.module.css";

interface IProps {
	contacts: IContactData[];
	selectedContact: number;
}

function Chat({ contacts, selectedContact }: IProps) {
	console.log(contacts[selectedContact].messages);

	return (
		<div className={styles.Body}>
			<UserInfo userData={contacts[selectedContact]} />
			<div className={styles.ChatContainer}>
				{contacts[selectedContact].messages.map((message) => (
					<h1 className="text" key={Math.random()}>
						{decrypt(
							message.text,
							contacts[selectedContact].sharedKey
						)}
					</h1>
				))}
			</div>
			<ChatInput />
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	contacts: state.contact.contacts,
	selectedContact: state.contact.selectedContact!,
});

export default connect(mapStateToProps)(Chat);
