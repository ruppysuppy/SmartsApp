import * as actionTypes from "../actions/actionTypes";
import { IUIState, IUIAction } from "../../shared/interfaces/interfaces";

const initialState: IUIState = {
	isDarkModeEnabled: false,
	isSideDrawerShown: false,
};

const reducer = (state: IUIState = initialState, action: IUIAction) => {
	const { type, payload } = action;

	switch (type) {
		case actionTypes.SET_IS_DARK_MODE_ENABLED:
			const { isDarkModeEnabled } = payload;
			if (isDarkModeEnabled !== undefined) {
				return { ...state, isDarkModeEnabled: isDarkModeEnabled };
			}
			return { ...state };

		case actionTypes.SET_IS_SIDE_DRAWER_SHOWN:
			const { isSideDrawerShown } = payload;
			if (isSideDrawerShown !== undefined) {
				return { ...state, isSideDrawerShown: isSideDrawerShown };
			}
			return { ...state };

		default:
			return { ...state };
	}
};

export default reducer;
