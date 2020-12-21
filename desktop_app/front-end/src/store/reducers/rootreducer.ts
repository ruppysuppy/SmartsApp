import { combineReducers } from "redux";

import authReducer from "./authReducer";
import uiReducer from "./uiReducer";
import contactReducer from "./contactReducer";

const rootReducer = combineReducers({
	auth: authReducer,
	ui: uiReducer,
	contact: contactReducer,
});

export default rootReducer;
