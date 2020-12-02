import firebase from "../../firebase/firebase";

export interface IAuthState {
	user?: firebase.User;
	userData?: IUserData;
	isLoading: boolean;
	error: string;
}

export interface IAction {
	type: string;
	payload?: {
		error?: string;
		user?: firebase.User;
		userData?: IUserData;
	};
}

export interface IState {
	auth: IAuthState;
}

export interface IUserData {
	username: string;
	uid: string;
	photoUrl: string;
	publicKey: string;
	about: String;
}

export interface IKeys {
	private_key: string;
	public_key: string;
}

export interface ICrop {
	x: number;
	y: number;
	width: number;
	height: number;
}
