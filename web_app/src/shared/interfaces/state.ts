import * as authInterfaces from "./auth";
import * as uiInterfaces from "./ui";

export interface IState {
	auth: authInterfaces.IAuthState;
	ui: uiInterfaces.IUIState;
}
