import { Dispatch } from "redux";
import axios from "axios";

import firebase, { auth, firestore } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import {
	IContactAction,
	IContactData,
	IUserData,
} from "../../shared/interfaces/interfaces";
import BASE_URL from "./baseUrl";

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

export const getContacts = (uid: string) => {
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
					const contacts = [];
					const userId = docSnapshot.data()!["0"];
					const userRef = firestore.collection("users").doc(userId);
					const userData = (await userRef.get()).data() as IUserData;
					const contactData = {
						...userData,
						messages: [],
					} as IContactData;
					contacts.push(contactData);
					dispatch(getContactsSuccess(contacts));
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
