export interface IUIState {
	isDarkModeEnabled: boolean;
}

export interface IUIAction {
	type: string;
	payload: {
		isDarkModeEnabled: boolean;
	};
}
