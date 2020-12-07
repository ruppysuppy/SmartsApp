import * as actionTypes from "../actions/actionTypes";
import { IAuthState, IAuthAction } from "../../shared/interfaces/interfaces";

const initialState: IAuthState = {
	user: undefined,
	userData: undefined,
	isLoading: false,
	error: "",
};

const reducer = (state: IAuthState = initialState, action: IAuthAction) => {
	const { type, payload } = action;

	switch (type) {
		case actionTypes.AUTH_CHANGED:
			if (payload?.user) {
				return {
					...state,
					user: payload.user,
					isLoading: false,
					error: "",
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
			if (payload?.error !== undefined) {
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
			if (payload?.error !== undefined) {
				return {
					...state,
					error: payload.error,
					isLoading: false,
				};
			}
			return { ...state };

		case actionTypes.LOGOUT:
			return { ...initialState };

		case actionTypes.GET_USER_DATA_INIT:
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case actionTypes.GET_USER_DATA_SUCCESS:
			if (payload?.userData) {
				return {
					...state,
					isLoading: false,
					userData: payload.userData,
				};
			}
			return { ...state };

		case actionTypes.GET_USER_DATA_FAIL:
			if (payload?.error !== undefined) {
				return {
					...state,
					error: payload.error,
					isLoading: false,
				};
			}
			return { ...state };

		case actionTypes.SET_USER_DATA_INIT:
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case actionTypes.SET_USER_DATA_SUCCESS:
			if (payload?.userData) {
				return {
					...state,
					isLoading: false,
					userData: payload.userData,
				};
			}
			return { ...state };

		case actionTypes.SET_USER_DATA_FAIL:
			if (payload?.error !== undefined) {
				return {
					...state,
					error: payload.error,
					isLoading: false,
				};
			}
			return { ...state };

		case actionTypes.SET_IMG_INIT:
			return {
				...state,
				isLoading: true,
				error: null,
			};

		case actionTypes.SET_IMG_SUCCESS:
			if (payload?.userData) {
				return {
					...state,
					isLoading: false,
					userData: payload.userData,
				};
			}
			return { ...state };

		case actionTypes.SET_IMG_FAIL:
			if (payload?.error !== undefined) {
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
