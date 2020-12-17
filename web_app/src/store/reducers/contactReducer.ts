import * as actionTypes from "../actions/actionTypes";
import {
	IContactAction,
	IContactState,
} from "../../shared/interfaces/interfaces";

const initialState: IContactState = {
	contacts: [],
	isLoading: false,
	isMessageLoading: false,
	error: "",
	selectedContact: undefined,
};

const reducer = (
	state: IContactState = initialState,
	action: IContactAction
) => {
	const { type, payload } = action;

	switch (type) {
		case actionTypes.ADD_CONTACT_FAIL:
			if (payload?.error !== undefined) {
				return { ...state, error: payload.error, isLoading: false };
			}
			return { ...state };

		case actionTypes.ADD_CONTACT_INIT:
			return { ...state, isLoading: true, error: "" };

		case actionTypes.ADD_CONTACT_SUCCESS:
			return { ...state, isLoading: false };

		case actionTypes.CLEAR_CONTACTS:
			return { ...initialState };

		case actionTypes.CLEAR_SELECTED_CONTACT:
			return { ...state, selectedContact: undefined };

		case actionTypes.GET_CONTACTS_FAIL:
			if (payload?.error !== undefined) {
				return { ...state, error: payload.error, isLoading: false };
			}
			return { ...state };

		case actionTypes.GET_CONTACTS_INIT:
			return { ...state, isLoading: true, error: "" };

		case actionTypes.GET_CONTACTS_SUCCESS:
			if (payload?.contacts !== undefined) {
				return {
					...state,
					isLoading: false,
					contacts: payload.contacts,
				};
			}
			return { ...state };

		case actionTypes.GET_PREVIOUS_MESSAGES_FAIL:
			if (payload?.error !== undefined) {
				return {
					...state,
					error: payload.error,
					isMessageLoading: false,
				};
			}
			return { ...state };

		case actionTypes.GET_PREVIOUS_MESSAGES_INIT:
			return { ...state, error: "", isMessageLoading: true };

		case actionTypes.GET_PREVIOUS_MESSAGES_SUCCESS:
			if (
				payload?.messages !== undefined &&
				payload?.selectionIndex !== undefined
			) {
				const stateCopy = {
					...state,
					contacts: [...state.contacts],
					isMessageLoading: false,
				};
				if (payload.messages.length === 0) {
					stateCopy.contacts[payload.selectionIndex].hasMore = false;
				} else {
					stateCopy.contacts[payload.selectionIndex].messages = [
						...payload.messages,
						...stateCopy.contacts[payload.selectionIndex].messages,
					];
				}
				return stateCopy;
			}
			return { ...state };

		case actionTypes.RESET_NEW_MESSAGES_COUNT:
			if (payload?.selectionIndex !== undefined) {
				const stateCopy = {
					...state,
					contacts: [...state.contacts],
				};
				stateCopy.contacts[payload.selectionIndex].newMessages = 0;
				return stateCopy;
			}
			return { ...state };

		case actionTypes.SELECT_CONTACT:
			if (payload?.selectionIndex !== undefined) {
				return { ...state, selectedContact: payload.selectionIndex };
			}
			return { ...state };

		case actionTypes.SEND_MESSAGE_FAIL:
			if (payload?.error !== undefined) {
				return { ...state, error: payload.error };
			}
			return { ...state };

		case actionTypes.SEND_MESSAGE_INIT:
			return { ...state, error: "" };

		case actionTypes.SEND_MESSAGE_SUCCESS:
			return {
				...state,
			};

		case actionTypes.UPDATE_MESSAGE_FAIL:
			if (payload?.error !== undefined) {
				return { ...state, error: payload.error };
			}
			return { ...state };

		case actionTypes.UPDATE_MESSAGE_INIT:
			return { ...state, error: "" };

		case actionTypes.UPDATE_MESSAGE_SUCCESS:
			if (
				payload?.message !== undefined &&
				payload?.selectionIndex !== undefined
			) {
				const stateCopy = {
					...state,
					contacts: [...state.contacts],
				};
				stateCopy.contacts[payload.selectionIndex].messages = [
					...stateCopy.contacts[payload.selectionIndex].messages,
					payload.message,
				];
				stateCopy.contacts[payload.selectionIndex].newMessages += 1;
				return stateCopy;
			}
			return { ...state };

		default:
			return { ...state };
	}
};

export default reducer;
