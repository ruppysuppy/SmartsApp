import { Dispatch } from "redux";
import axios from "axios";

import firebase, { auth, firestore } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import {
	IAuthAction,
	IUserData,
	IKeys,
} from "../../shared/interfaces/interfaces";
import BASE_URL from "./baseUrl";

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
	return async (dispatch: Dispatch<IAuthAction>) => {
		dispatch(emailAuthInit());
		try {
			await auth.createUserWithEmailAndPassword(email, password);
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
	return async (dispatch: Dispatch<IAuthAction>) => {
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
	return async (dispatch: Dispatch<IAuthAction>) => {
		dispatch(getUserDataInit());
		try {
			const userRef = firestore.collection("users").doc(uid);
			const doc = await userRef.get();
			if (!doc.exists) {
				dispatch(getUserDataFail("User data not found"));
				return;
			}

			const privateKeyRef = firestore.collection("keys").doc(uid);
			const keyDoc = await privateKeyRef.get();
			if (!keyDoc.exists) {
				dispatch(getUserDataFail("Key not found"));
				return;
			}

			dispatch(
				getUserDataSuccess({
					...(doc.data() as IUserData),
					privateKey: keyDoc.data()!.privateKey,
				})
			);
		} catch (error) {
			dispatch(getUserDataFail(error.message));
		}
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
	return async (dispatch: Dispatch<IAuthAction>) => {
		dispatch(setUserDataInit());
		try {
			const userRef = firestore
				.collection("users")
				.where("username", "==", userData.username);
			const doc = await userRef.get();
			if (!doc.empty) {
				dispatch(setUserDataFail("Username already in use"));
				return;
			}
		} catch (error) {
			dispatch(setUserDataFail(error.message));
			return;
		}

		let keys: IKeys;
		try {
			const response = await axios.get(`${BASE_URL}/generate-keys`);
			keys = response.data as IKeys;

			userData.publicKey = keys.public_key;
			userData.privateKey = keys.private_key;
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

export const setImgInit = () => {
	return {
		type: actionTypes.SET_IMG_INIT,
	};
};

export const setImgSuccess = (userData: IUserData) => {
	return {
		type: actionTypes.SET_IMG_SUCCESS,
		payload: {
			userData: userData,
		},
	};
};

export const setImgFail = (error: string) => {
	return {
		type: actionTypes.SET_IMG_FAIL,
		payload: {
			error: error,
		},
	};
};

export const setImg = (userData: IUserData) => {
	return async (dispatch: Dispatch<IAuthAction>) => {
		dispatch(setImgInit());
		const userRef = firestore.collection("users").doc(userData.uid);
		try {
			await userRef.update({ photoUrl: userData.photoUrl });
			dispatch(setImgSuccess(userData));
		} catch (error) {
			dispatch(setImgFail(error.message));
		}
	};
};

export const setAboutInit = () => {
	return {
		type: actionTypes.SET_ABOUT_INIT,
	};
};

export const setAboutSuccess = (userData: IUserData) => {
	return {
		type: actionTypes.SET_ABOUT_SUCCESS,
		payload: {
			userData: userData,
		},
	};
};

export const setAboutFail = (error: string) => {
	return {
		type: actionTypes.SET_ABOUT_FAIL,
		payload: {
			error: error,
		},
	};
};

export const setAbout = (userData: IUserData) => {
	return async (dispatch: Dispatch<IAuthAction>) => {
		dispatch(setAboutInit());
		const userRef = firestore.collection("users").doc(userData.uid);
		try {
			await userRef.update({ about: userData.about });
			dispatch(setAboutSuccess(userData));
		} catch (error) {
			dispatch(setAboutFail(error.message));
		}
	};
};
