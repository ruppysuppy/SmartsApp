import * as actionTypes from "../actions/actionTypes";
import {
	IContactAction,
	IContactState,
} from "../../shared/interfaces/interfaces";

const initialState: IContactState = {
	contacts: [],
	isLoading: false,
	error: "",
};

const reducer = (
	state: IContactState = initialState,
	action: IContactAction
) => {
	const { type, payload } = action;

	switch (type) {
		case actionTypes.GET_CONTACTS_INIT:
			return { ...state, isLoading: true, error: "" };

		case actionTypes.GET_CONTACTS_FAIL:
			if (payload?.error !== undefined) {
				return { ...state, error: payload.error, isLoading: false };
			}
			return { ...state };

		case actionTypes.GET_CONTACTS_SUCCESS:
			if (payload?.contacts !== undefined) {
				return {
					...state,
					isLoading: false,
					contacts: payload.contacts,
				};
			}
			return { ...state };

		case actionTypes.ADD_CONTACT_INIT:
			return { ...state, isLoading: true, error: "" };

		case actionTypes.ADD_CONTACT_FAIL:
			if (payload?.error !== undefined) {
				return { ...state, error: payload.error, isLoading: false };
			}
			return { ...state };

		case actionTypes.ADD_CONTACT_SUCCESS:
			return { ...state, isLoading: false };

		default:
			return { ...state };
	}
};

export default reducer;
