import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";

import firebase, { auth } from "../../../firebase/firebase";
import { IState } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

interface IProps {
	logout: () => void;
	user?: firebase.User;
}

function Logout({ logout, user }: IProps) {
	useEffect(() => {
		if (user) {
			auth.signOut();
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
