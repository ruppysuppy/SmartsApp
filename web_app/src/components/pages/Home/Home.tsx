import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import firebase from "../../../firebase/firebase";
import { IState } from "../../../shared/interfaces/Interfaces";

interface IProps {
	user?: firebase.User;
}

function Home({ user }: IProps) {
	if (!user) {
		return <Redirect to="/login" />;
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
});

export default connect(mapStateToProps)(Home);
