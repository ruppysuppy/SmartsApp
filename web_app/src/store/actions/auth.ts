import { Dispatch } from "redux";

import firebase, { auth, firestore } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import { IAction } from "../../shared/interfaces/Interfaces";

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
			// const userRef = firestore.collection("users").doc(username);
			// const doc = await userRef.get();
			// if (doc.exists) {
			// 	dispatch(
			// 		emailAuthFail(
			// 			"This username already in use by another account"
			// 		)
			// 	);
			// 	return;
			// }
			const userData = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			// await userRef.set({
			// 	uid: userData.user?.uid,
			// 	photoURL: `https://avatars.dicebear.com/api/human/${Math.floor(
			// 		Math.random() * 250
			// 	)}.svg`,
			// });
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
