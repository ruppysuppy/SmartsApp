import { Dispatch } from "redux";

import firebase, { auth } from "../../firebase/firebase";
import * as actionTypes from "./actionTypes";
import { Action as AuthAction } from "../reducers/authReducer";

export const authChangedHandler = (user: firebase.User) => {
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
	return (dispatch: Dispatch<AuthAction>) => {
		dispatch(emailAuthInit());
		auth.createUserWithEmailAndPassword(email, password)
			.then(() => dispatch(emailRegisterSuccess()))
			.catch((error) => dispatch(emailAuthFail(error.message)));
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
	return (dispatch: Dispatch<AuthAction>) => {
		dispatch(emailAuthInit());
		auth.signInWithEmailAndPassword(email, password).catch((error) =>
			dispatch(emailAuthFail(error.message))
		);
	};
};
