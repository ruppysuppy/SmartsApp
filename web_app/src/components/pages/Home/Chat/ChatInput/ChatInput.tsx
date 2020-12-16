import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import imageCompression from "browser-image-compression";

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
	sendImage: (
		uid: string,
		otherId: string,
		image: File | Blob,
		sharedKey: string
	) => void;
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
	sendImage,
}: IProps) {
	const [message, setMessage] = useState("");

	const inputRef = useRef<HTMLInputElement>(null);

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

	const selectImageHandler = () => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

	const onFileChangeHandler = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.currentTarget.files) {
			const image = event.currentTarget.files[0];
			const options = {
				maxSizeMB: 0.4,
				useWebWorker: true,
			};

			try {
				const compressedFile = await imageCompression(image, options);
				sendImage(
					userData!.uid,
					contacts[selectedContact!].uid,
					compressedFile,
					contacts[selectedContact!].sharedKey
				);
			} catch (error) {
				console.log(error);
			}
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
			<input
				className={styles.AttachmentInput}
				type="file"
				name="attachmentInput"
				id="attachmentInput"
				accept="image/*"
				ref={inputRef}
				onChange={onFileChangeHandler}
			/>
			<span
				className={`${styles.Btn} ${styles.BtnSecondary}`}
				onClick={selectImageHandler}
			>
				<i className="material-icons">attach_file</i>
			</span>
			<span
				className={`${styles.Btn} ${styles.BtnPrimary}`}
				onClick={onSubmitHandler}
			>
				<i className="material-icons">send</i>
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
	sendImage: (
		uid: string,
		otherId: string,
		image: File | Blob,
		sharedKey: string
	) => dispatch(actions.sendImage(uid, otherId, image, sharedKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
