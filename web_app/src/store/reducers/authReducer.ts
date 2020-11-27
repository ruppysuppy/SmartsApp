import firebase from "firebase";

import * as actionTypes from "../actions/actionTypes";

interface State {
	user: null;
	isLoading: boolean;
	registered: boolean;
	error: null;
}

export interface Action {
	type: string;
	payload?: {
		error?: string;
		user?: firebase.User;
	};
}

const initialState: State = {
	user: null,
	isLoading: false,
	registered: false,
	error: null,
};

const reducer = (state: State = initialState, action: Action) => {
	const { type, payload } = action;

	switch (type) {
		case actionTypes.AUTH_CHANGED:
			if (payload?.user) {
				return {
					...state,
					user: payload.user,
					isLoading: false,
					error: null,
				};
			}
			return { ...state };

		case actionTypes.EMAIL_REGISTER_INIT:
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case actionTypes.EMAIL_REGISTER_SUCCESS:
			return {
				...state,
				isLoading: false,
				registered: true,
			};

		case actionTypes.EMAIL_REGISTER_FAIL:
			if (payload?.error) {
				return {
					...state,
					error: payload.error,
					isLoading: false,
				};
			}
			return { ...state };

		case actionTypes.EMAIL_AUTH_INIT:
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case actionTypes.EMAIL_AUTH_FAIL:
			if (payload?.error) {
				return {
					...state,
					error: payload.error,
					isLoading: false,
				};
			}
			return { ...state };

		default:
			return state;
	}
};

export default reducer;
