import React, { useCallback, useEffect, useRef } from "react";
import { connect } from "react-redux";

import UserInfo from "./UserInfo/UserInfo";
import ChatInput from "./ChatInput/ChatInput";
import ChatMessage from "./ChatMessage/ChatMessage";
import Loader from "../../../ui/Loader/Loader";

import {
	IContactData,
	IState,
	IUserData,
} from "../../../../shared/interfaces/interfaces";
import * as actions from "../../../../store/actions/actions";

import styles from "./chat.module.css";

interface IProps {
	contacts: IContactData[];
	selectedContact: number;
	userData: IUserData;
	isMessageLoading: boolean;
	getPreviousMessages: (
		uid: string,
		otherId: string,
		lastTimestamp: number
	) => Promise<void>;
	resetNewMessageReceived: (uid: string) => void;
}

function Chat({
	contacts,
	selectedContact,
	userData,
	isMessageLoading,
	getPreviousMessages,
	resetNewMessageReceived,
}: IProps) {
	const newMessages = contacts[selectedContact].newMessages;

	useEffect(() => {
		scrollToChatBottom();
	}, [selectedContact]);
	useEffect(() => {
		if (newMessages > 0) {
			resetNewMessageReceived(contacts[selectedContact].uid);
			scrollToChatBottom();
		}
	}, [newMessages]);

	const chatContainerRef = useRef<HTMLDivElement | null>(null);
	const firstMessagObserver = useRef<
		HTMLSpanElement | IntersectionObserver
	>();

	const hasMore = contacts[selectedContact].hasMore;

	const scrollToChatBottom = (isSmooth: boolean = false) => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				behavior: isSmooth ? "smooth" : "auto",
				top:
					chatContainerRef.current.scrollHeight -
					chatContainerRef.current.clientHeight,
			});
		}
	};

	const scrollChat = (prevHeight: number) => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				top: chatContainerRef.current.scrollHeight - prevHeight,
			});
		}
	};

	const firstMessageRef = useCallback(
		(node) => {
			if (isMessageLoading) {
				return;
			}
			if (firstMessagObserver.current) {
				try {
					/// @ts-ignore
					firstMessagObserver.current.disconnect();
				} catch (error) {
					console.log(error.message);
				}
			}
			firstMessagObserver.current = new IntersectionObserver(
				async (entries) => {
					if (
						entries[0].isIntersecting &&
						hasMore &&
						chatContainerRef.current
					) {
						const currHeight =
							chatContainerRef.current.scrollHeight;
						await getPreviousMessages(
							userData.uid,
							contacts[selectedContact].uid,
							contacts[selectedContact].messages[0].timestamp
						);
						scrollChat(currHeight);
					}
				}
			);
			if (node) {
				firstMessagObserver.current.observe(node);
			}
		},
		[isMessageLoading, hasMore]
	);

	return (
		<div className={styles.Body}>
			<UserInfo userData={contacts[selectedContact]} />
			<div className={styles.ChatContainer} ref={chatContainerRef}>
				{isMessageLoading && (
					<div className="d-flex justify-content-center my-2">
						<Loader />
					</div>
				)}
				{contacts[selectedContact].messages.map((message, index) => {
					const lastDate =
						index === 0
							? ""
							: new Date(
									contacts[selectedContact].messages[
										index - 1
									].timestamp
							  );
					const currDate = new Date(message.timestamp);
					const lastDateString =
						lastDate === ""
							? ""
							: `${lastDate.getDate()}/${lastDate.getMonth()}/${lastDate.getFullYear()}`;
					const currDateString = `${currDate.getDate()}/${currDate.getMonth()}/${currDate.getFullYear()}`;
					const shouldDisplayDate =
						lastDate === "" || lastDateString !== currDateString;

					return (
						<>
							{shouldDisplayDate && (
								<span className={styles.DateDisplay}>
									{currDateString}
								</span>
							)}
							{index === 0 ? (
								<ChatMessage
									isUserSent={message.sender === userData.uid}
									text={message.text}
									sharedKey={
										contacts[selectedContact].sharedKey
									}
									isMedia={message.isMedia}
									timestamp={message.timestamp}
									key={message.uid!}
									reference={firstMessageRef}
								/>
							) : (
								<ChatMessage
									isUserSent={message.sender === userData.uid}
									text={message.text}
									sharedKey={
										contacts[selectedContact].sharedKey
									}
									isMedia={message.isMedia}
									timestamp={message.timestamp}
									key={message.uid!}
								/>
							)}
						</>
					);
				})}
			</div>
			<ChatInput />
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	contacts: state.contact.contacts,
	selectedContact: state.contact.selectedContact!,
	userData: state.auth.userData!,
	isMessageLoading: state.contact.isMessageLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
	getPreviousMessages: async (
		uid: string,
		otherId: string,
		lastTimestamp: number
	) =>
		await dispatch(
			actions.getPreviousMessages(uid, otherId, lastTimestamp)
		),
	resetNewMessageReceived: (uid: string) =>
		dispatch(actions.resetNewMessageReceived(uid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
