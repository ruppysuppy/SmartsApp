import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import firebase from "../../../firebase/firebase";
import { IUserData, IState } from "../../../shared/interfaces/Interfaces";

interface IProps {
	user?: firebase.User;
	userData?: IUserData;
}

function Home({ user, userData }: IProps) {
	if (!user) {
		return <Redirect to="/login" />;
	}
	if (!userData) {
		return <Redirect to="/user-details" />;
	}

	return (
		<>
			<h1>HOME</h1>
			<h1>HOME</h1>
			<h1>HOME</h1>
			<h1>HOME</h1>
			<h1>HOME</h1>
			<h1>HOME</h1>
			<h1>HOME</h1>
			<h1>HOME</h1>
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	user: state.auth.user,
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(Home);
