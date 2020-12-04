import * as actionTypes from "../actions/actionTypes";
import { IUIState, IUIAction } from "../../shared/interfaces/Interfaces";

const initialState: IUIState = {
	isDarkModeEnabled: false,
};

const reducer = (state: IUIState = initialState, action: IUIAction) => {
	const { type, payload } = action;

	switch (type) {
		case actionTypes.SET_IS_DARK_MODE_ENABLED:
			const { isDarkModeEnabled } = payload;
			return { ...state, isDarkModeEnabled: isDarkModeEnabled };

		default:
			return state;
	}
};

export default reducer;
