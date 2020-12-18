import { Dispatch } from "redux";
import axios, { AxiosResponse } from "axios";
import { v4 as uuid } from "uuid";

import firebase, { firestore, storage } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import {
	IContactAction,
	IContactData,
	IMessage,
	IUserData,
} from "../../shared/interfaces/interfaces";
import { encrypt } from "../../cryptography/cipher";
import BASE_URL from "./baseUrl";

// Data Cache for fast access
let previousData: IContactData[] = [];
const userIndexMap: { [key: string]: number } = {};
const messageSnapshotListeners = new Set<string>();

// Action creators

export const addContactInit = () => {
	return {
		type: actionTypes.ADD_CONTACT_INIT,
	};
};

export const addContactSuccess = () => {
	return {
		type: actionTypes.ADD_CONTACT_SUCCESS,
	};
};

export const addContactFail = (error: string) => {
	return {
		type: actionTypes.ADD_CONTACT_FAIL,
		payload: {
			error: error,
		},
	};
};

export const addContact = (userId: string, username: string) => {
	return async (dispatch: Dispatch<IContactAction>) => {
		dispatch(addContactInit());
		try {
			const userRef = firestore
				.collection("users")
				.where("username", "==", username);
			const userData = await userRef.get();
			if (userData.empty) {
				dispatch(addContactFail("User does not exist"));
				return;
			}
			const uid = (userData.docs[0].data() as IUserData).uid;
			const userContactsRef = firestore
				.collection("contacts")
				.doc(userId);
			const contactContactsRef = firestore
				.collection("contacts")
				.doc(uid);
			if (!(await userContactsRef.get()).exists) {
				await userContactsRef.set({ contacts: [uid] });
			} else {
				await userContactsRef.update({
					contacts: firebase.firestore.FieldValue.arrayUnion(uid),
				});
			}
			if (!(await contactContactsRef.get()).exists) {
				await contactContactsRef.set({ contacts: [userId] });
			} else {
				await contactContactsRef.update({
					contacts: firebase.firestore.FieldValue.arrayUnion(userId),
				});
			}
			dispatch(addContactSuccess());
		} catch (error) {
			dispatch(addContactFail(error.message));
		}
	};
};

export const clearContacts = () => {
	return {
		type: actionTypes.CLEAR_CONTACTS,
	};
};

export const clearSelectContact = () => {
	return {
		type: actionTypes.CLEAR_SELECTED_CONTACT,
	};
};

export const getContactsInit = () => {
	return {
		type: actionTypes.GET_CONTACTS_INIT,
	};
};

export const getContactsSuccess = (contacts: IContactData[]) => {
	return {
		type: actionTypes.GET_CONTACTS_SUCCESS,
		payload: {
			contacts: contacts,
		},
	};
};

export const getContactsFail = (error: string) => {
	return {
		type: actionTypes.GET_CONTACTS_FAIL,
		payload: {
			error: error,
		},
	};
};

export const getContacts = (uid: string, privateKey: string) => {
	return async (dispatch: Dispatch<IContactAction>) => {
		dispatch(getContactsInit());
		try {
			const contactsRef = firestore.collection("contacts").doc(uid);
			const doc = await contactsRef.get();
			if (!doc.exists) {
				dispatch(getContactsSuccess([]));
				return;
			}

			contactsRef.onSnapshot(
				async (docSnapshot) => {
					const contacts: IContactData[] = [];
					const contactList: string[] = docSnapshot.data()!.contacts;
					const userPromiseArr: Promise<
						firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
					>[] = [];
					try {
						contactList.map((uid) => {
							userPromiseArr.push(
								firestore.collection("users").doc(uid).get()
							);
						});
						const users = await Promise.all(userPromiseArr);
						const userDataArr = users.map(
							(user) => user.data() as IUserData
						);
						const keyPromiseArr: Promise<
							| AxiosResponse<{ shared_key: string }>
							| { data: { shared_key: string } }
						>[] = [];
						const messagesArr: IMessage[][] = [];
						userDataArr.map((user, index) => {
							if (
								previousData.length > index &&
								previousData[index].uid === user.uid
							) {
								keyPromiseArr.push(
									Promise.resolve({
										data: {
											shared_key:
												previousData[index].sharedKey,
										},
									})
								);
								messagesArr.push([
									...previousData[index].messages,
								]);
							} else {
								keyPromiseArr.push(
									axios.get(
										`${BASE_URL}/generate-shared-key?local_private_key=${privateKey}&remote_public_key=${user.publicKey}`
									)
								);
								messagesArr.push([]);
							}
						});
						const keys = (await Promise.all(keyPromiseArr)).map(
							(value) => value.data
						);
						userDataArr.map((user, index) => {
							contacts.push({
								...user,
								sharedKey: keys[index].shared_key,
								messages: messagesArr[index],
								hasMore: true,
								newMessages: 0,
							} as IContactData);
							userIndexMap[user.uid] = index;
						});
						previousData = contacts;
						dispatch(getContactsSuccess(contacts));
						userDataArr.map((user) => {
							if (!(user.uid in messageSnapshotListeners)) {
								messageSnapshotListeners.add(user.uid);
								const users = [user.uid, uid];
								users.sort();
								const usersList = users.join(",");
								firestore
									.collection("messages")
									.where("users", "==", usersList)
									.orderBy("timestamp", "desc")
									.limit(1)
									.onSnapshot((docSnapshot) => {
										docSnapshot.forEach((snapshot) => {
											dispatch(
												updateMessageSuccess(
													{
														...snapshot.data(),
														uid: snapshot.id,
													} as IMessage,
													userIndexMap[user.uid]
												)
											);
										});
									});
							}
						});
					} catch (error) {
						dispatch(getContactsFail(error.message));
					}
				},
				(error) => {
					dispatch(getContactsFail(error.message));
				}
			);
		} catch (error) {
			dispatch(getContactsFail(error.message));
		}
	};
};

export const getPreviousMessagesInit = () => {
	return {
		type: actionTypes.GET_PREVIOUS_MESSAGES_INIT,
	};
};

export const getPreviousMessagesFail = (error: string) => {
	return {
		type: actionTypes.GET_PREVIOUS_MESSAGES_FAIL,
		payload: {
			error: error,
		},
	};
};

export const getPreviousMessagesSuccess = (
	messages: IMessage[],
	selectionIndex: number
) => {
	return {
		type: actionTypes.GET_PREVIOUS_MESSAGES_SUCCESS,
		payload: {
			messages: messages,
			selectionIndex: selectionIndex,
		},
	};
};

export const getPreviousMessages = (
	uid: string,
	otherId: string,
	lastTimestamp: number
) => {
	return async (dispatch: Dispatch) => {
		dispatch(getPreviousMessagesInit());
		const users = [otherId, uid];
		users.sort();
		const usersList = users.join(",");
		const query = firestore
			.collection("messages")
			.where("users", "==", usersList)
			.where("timestamp", "<", lastTimestamp)
			.orderBy("timestamp", "desc")
			.limit(20);
		try {
			const docs = await query.get();
			const messages: IMessage[] = [];
			docs.forEach((doc) => {
				messages.push({ ...doc.data(), uid: doc.id } as IMessage);
			});
			messages.reverse();
			dispatch(
				getPreviousMessagesSuccess(messages, userIndexMap[otherId])
			);
		} catch (error) {
			dispatch(getPreviousMessagesFail(error.message));
		}
	};
};

export const resetNewMessageReceived = (uid: string) => {
	return {
		type: actionTypes.RESET_NEW_MESSAGES_COUNT,
		payload: {
			selectionIndex: userIndexMap[uid],
		},
	};
};

export const selectContact = (index: number) => {
	return {
		type: actionTypes.SELECT_CONTACT,
		payload: {
			selectionIndex: index,
		},
	};
};

export const sendImage = (
	uid: string,
	otherId: string,
	image: File | Blob,
	sharedKey: string
) => {
	return (dispatch: Dispatch<IContactAction>) => {
		dispatch(sendMessageInit());
		try {
			const uploadTask = storage.ref("media").child(uuid()).put(image);

			uploadTask.on(
				"state_changed",
				function (_) {},
				function (error) {
					dispatch(sendMessageFail(error.message));
				},
				function () {
					uploadTask.snapshot.ref
						.getDownloadURL()
						.then(async (downloadURL) => {
							const encryptedMessage = encrypt(
								downloadURL,
								sharedKey
							);
							const users = [otherId, uid];
							users.sort();
							const messageData: IMessage = {
								sender: uid,
								users: users.join(","),
								text: encryptedMessage,
								timestamp: new Date().getTime(),
								isMedia: true,
							};
							try {
								await firestore
									.collection("messages")
									.add(messageData);
								dispatch(sendMessageSuccess());
							} catch (error) {
								dispatch(sendMessageFail(error.message));
							}
						});
				}
			);
		} catch (error) {
			dispatch(sendMessageFail(error.message));
		}
	};
};

export const sendMessageInit = () => {
	return {
		type: actionTypes.SEND_MESSAGE_INIT,
	};
};

export const sendMessageFail = (error: string) => {
	return {
		type: actionTypes.SEND_MESSAGE_FAIL,
		payload: {
			error: error,
		},
	};
};

export const sendMessageSuccess = () => {
	return {
		type: actionTypes.SEND_MESSAGE_SUCCESS,
	};
};

export const sendMessage = (
	uid: string,
	otherId: string,
	message: string,
	sharedKey: string
) => {
	return async (dispatch: Dispatch<IContactAction>) => {
		dispatch(sendMessageInit());
		const encryptedMessage = encrypt(message, sharedKey);
		const users = [otherId, uid];
		users.sort();
		const messageData: IMessage = {
			sender: uid,
			users: users.join(","),
			text: encryptedMessage,
			timestamp: new Date().getTime(),
		};
		try {
			await firestore.collection("messages").add(messageData);
			dispatch(sendMessageSuccess());
		} catch (error) {
			dispatch(sendMessageFail(error.message));
		}
	};
};

export const updateMessageInit = () => {
	return {
		type: actionTypes.UPDATE_MESSAGE_INIT,
	};
};

export const updateMessageFail = (error: string) => {
	return {
		type: actionTypes.UPDATE_MESSAGE_FAIL,
		payload: {
			error: error,
		},
	};
};

export const updateMessageSuccess = (
	message: IMessage,
	selectionIndex: number
) => {
	return {
		type: actionTypes.UPDATE_MESSAGE_SUCCESS,
		payload: {
			message: message,
			selectionIndex: selectionIndex,
		},
	};
};
