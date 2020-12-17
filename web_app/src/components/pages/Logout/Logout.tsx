import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";

import firebase, { auth } from "../../../firebase/firebase";
import { IState } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

interface IProps {
	user?: firebase.User;
	clearContacts: () => void;
	logout: () => void;
}

function Logout({ user, clearContacts, logout }: IProps) {
	useEffect(() => {
		if (user) {
			auth.signOut();
			clearContacts();
			logout();
		}
	}, []);

	return <Redirect to="/" />;
}

const mapStateToProps = (state: IState) => ({
	user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	logout: () => dispatch(actions.logout()),
	clearContacts: () => dispatch(actions.clearContacts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
