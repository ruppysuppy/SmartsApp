import { Dispatch } from "redux";
import axios from "axios";

import firebase, { auth, firestore } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import { IAction, IUserData, IKeys } from "../../shared/interfaces/Interfaces";

export const authChangedHandler = (user?: firebase.User) => {
	return {
		type: actionTypes.AUTH_CHANGED,
		payload: {
			user: user,
		},
	};
};

export const emailRegisterInit = () => {
	return {
		type: actionTypes.EMAIL_REGISTER_INIT,
	};
};

export const emailRegisterSuccess = () => {
	return {
		type: actionTypes.EMAIL_REGISTER_SUCCESS,
	};
};

export const emailRegisterFail = (error: string) => {
	return {
		type: actionTypes.EMAIL_REGISTER_FAIL,
		payload: {
			error: error,
		},
	};
};

export const emailRegister = (email: string, password: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		dispatch(emailAuthInit());
		try {
			const userData = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			dispatch(emailRegisterSuccess());
		} catch (error) {
			dispatch(emailAuthFail(error.message));
		}
	};
};

export const emailAuthInit = () => {
	return {
		type: actionTypes.EMAIL_AUTH_INIT,
	};
};

export const emailAuthFail = (error: string) => {
	return {
		type: actionTypes.EMAIL_AUTH_FAIL,
		payload: {
			error: error,
		},
	};
};

export const emailAuth = (email: string, password: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		dispatch(emailAuthInit());
		try {
			await auth.signInWithEmailAndPassword(email, password);
		} catch (error) {
			dispatch(emailAuthFail(error.message));
		}
	};
};

export const logout = () => {
	return {
		type: actionTypes.LOGOUT,
	};
};

export const getUserDataInit = () => {
	return {
		type: actionTypes.GET_USER_DATA_INIT,
	};
};

export const getUserDataSuccess = (userData: IUserData) => {
	return {
		type: actionTypes.GET_USER_DATA_SUCCESS,
		payload: {
			userData: userData,
		},
	};
};

export const getUserDataFail = (error: string) => {
	return {
		type: actionTypes.GET_USER_DATA_FAIL,
		payload: {
			error: error,
		},
	};
};

export const getUserData = (uid: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		dispatch(getUserDataInit());
		const userRef = firestore.collection("users").doc(uid);
		const doc = await userRef.get();
		if (!doc.exists) {
			dispatch(getUserDataFail("User data not found"));
			return;
		}
		dispatch(getUserDataSuccess(doc.data() as IUserData));
	};
};

export const setUserDataInit = () => {
	return {
		type: actionTypes.SET_USER_DATA_INIT,
	};
};

export const setUserDataSuccess = (userData: IUserData) => {
	return {
		type: actionTypes.SET_USER_DATA_SUCCESS,
		payload: {
			userData: userData,
		},
	};
};

export const setUserDataFail = (error: string) => {
	return {
		type: actionTypes.SET_USER_DATA_FAIL,
		payload: {
			error: error,
		},
	};
};

export const setUserData = (userData: IUserData) => {
	return async (dispatch: Dispatch<IAction>) => {
		dispatch(setUserDataInit());
		const userRef = firestore
			.collection("users")
			.where("username", "==", userData.username);
		const doc = await userRef.get();
		if (!doc.empty) {
			dispatch(setUserDataFail("Username already in use"));
			return;
		}
		let keys: IKeys;
		console.log("resquesting");

		try {
			const response = await axios.get(
				"http://127.0.0.1:5000/generate-keys"
			);

			keys = response.data as IKeys;
			console.log(keys);

			userData.publicKey = keys.public_key;
		} catch (error) {
			dispatch(setUserDataFail(error.message));
			return;
		}
		const setKeyRef = firestore.collection("keys").doc(userData.uid);
		const setUserRef = firestore.collection("users").doc(userData.uid);
		try {
			await setKeyRef.set({ privateKey: keys.private_key });
			await setUserRef.set(userData);
			dispatch(setUserDataSuccess(userData));
		} catch (error) {
			dispatch(setUserDataFail(error.message));
		}
	};
};
