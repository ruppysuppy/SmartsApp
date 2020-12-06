import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import firebase from "../../../firebase/firebase";
import { IUserData, IState } from "../../../shared/interfaces/Interfaces";

import sharedStyles from "../../../shared/styles/auth.module.css";

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
		<div className={sharedStyles.OverflowContainer}>
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
				(elem, index) => (
					<h1 className="text" key={index}>
						HOME {elem}
					</h1>
				)
			)}
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	user: state.auth.user,
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(Home);
