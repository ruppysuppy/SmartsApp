import * as actionTypes from "./actionTypes";

export const setIsDarkModeEnabled = (value: boolean) => {
	return {
		type: actionTypes.SET_IS_DARK_MODE_ENABLED,
		payload: {
			isDarkModeEnabled: value,
		},
	};
};

export const setIsSideDrawerShown = (value: boolean) => {
	return {
		type: actionTypes.SET_IS_SIDE_DRAWER_SHOWN,
		payload: {
			isSideDrawerShown: value,
		},
	};
};
