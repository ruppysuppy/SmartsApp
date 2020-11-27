import * as actionTypes from "../actions/actionTypes";
import { IAuthState, IAction } from "../../shared/interfaces/Interfaces";

const initialState: IAuthState = {
	user: undefined,
	isLoading: false,
	error: "",
};

const reducer = (state: IAuthState = initialState, action: IAction) => {
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
