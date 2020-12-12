export interface IContactData {
	username: string;
	uid: string;
	photoUrl: string;
	publicKey: string;
	sharedKey: string;
	about: string;
	messages: IMessage[];
}

export interface IContactState {
	contacts: IContactData[];
	isLoading: boolean;
	error: string;
	selectedContact?: number;
}

export interface IMessage {
	sender: string;
	users: string;
	text: string;
	timestamp: number;
}

export interface IContactAction {
	type: string;
	payload?: {
		contacts?: IContactData[];
		error?: string;
		selectionIndex?: number;
		message?: IMessage;
	};
}
