import firebase from "../../firebase/firebase";

export interface IAuthState {
	user?: firebase.User;
	isLoading: boolean;
	error: string;
}

export interface IAction {
	type: string;
	payload?: {
		error?: string;
		user?: firebase.User;
	};
}

export interface IState {
	auth: IAuthState;
}
