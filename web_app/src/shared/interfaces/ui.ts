export interface IUIState {
	isDarkModeEnabled: boolean;
	isSideDrawerShown: boolean;
}

export interface IUIAction {
	type: string;
	payload: {
		isDarkModeEnabled?: boolean;
		isSideDrawerShown?: boolean;
	};
}
