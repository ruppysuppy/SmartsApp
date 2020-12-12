import { Dispatch } from "redux";
import axios, { AxiosResponse } from "axios";

import firebase, { firestore } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import {
	IContactAction,
	IContactData,
	IMessage,
	IUserData,
} from "../../shared/interfaces/interfaces";
import BASE_URL from "./baseUrl";

let previousData: IContactData[] = [];

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
							} as IContactData);
						});
						previousData = contacts;
						dispatch(getContactsSuccess(contacts));
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

export const selectContact = (index: number) => {
	return {
		type: actionTypes.SELECT_CONTACT,
		payload: {
			selectionIndex: index,
		},
	};
};

export const clearSelectContact = () => {
	return {
		type: actionTypes.CLEAR_SELECTED_CONTACT,
	};
};
