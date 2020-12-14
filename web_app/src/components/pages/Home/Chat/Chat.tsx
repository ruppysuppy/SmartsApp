import React from "react";
import { connect } from "react-redux";

import UserInfo from "./UserInfo/UserInfo";
import ChatInput from "./ChatInput/ChatInput";
import ChatMessage from "./ChatMessage/ChatMessage";

import {
	IContactData,
	IState,
	IUserData,
} from "../../../../shared/interfaces/interfaces";

import styles from "./chat.module.css";

interface IProps {
	contacts: IContactData[];
	selectedContact: number;
	userData: IUserData;
}

function Chat({ contacts, selectedContact, userData }: IProps) {
	return (
		<div className={styles.Body}>
			<UserInfo userData={contacts[selectedContact]} />
			<div className={styles.ChatContainer}>
				{contacts[selectedContact].messages.map((message) => (
					<ChatMessage
						isUserSent={message.sender === userData.uid}
						text={message.text}
						sharedKey={contacts[selectedContact].sharedKey}
						timestamp={message.timestamp}
						key={message.uid!}
					/>
				))}
			</div>
			<ChatInput />
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	contacts: state.contact.contacts,
	selectedContact: state.contact.selectedContact!,
	userData: state.auth.userData!,
});

export default connect(mapStateToProps)(Chat);
