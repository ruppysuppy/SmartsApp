import firebase from "../../firebase/firebase";
import * as userInterfaces from "./user";

export interface IAuthAction {
	type: string;
	payload?: {
		error?: string;
		user?: firebase.User;
		userData?: userInterfaces.IUserData;
	};
}

export interface IAuthState {
	user?: firebase.User;
	userData?: userInterfaces.IUserData;
	isLoading: boolean;
	error: string;
}
