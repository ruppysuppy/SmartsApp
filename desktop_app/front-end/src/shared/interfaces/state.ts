import { IAuthState } from "./auth";
import { IUIState } from "./ui";
import { IContactState } from "./contacts";

export interface IState {
	auth: IAuthState;
	contact: IContactState;
	ui: IUIState;
}
