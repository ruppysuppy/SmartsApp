import React from "react";
import { connect } from "react-redux";

import firebase, { auth } from "../../../firebase/firebase";
import * as actions from "../../../store/actions/actions";

import styles from "./googleAuth.module.css";

interface IProps {
	authChangedHandler: (user?: firebase.User) => void;
}

function GoogleAuth({ authChangedHandler }: IProps) {
	const OAuthHalder = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithRedirect(provider);
		const result = await auth.getRedirectResult();
		const user = result.user;
		if (user) {
			authChangedHandler(user);
		}
	};

	return (
		<div className={styles.Body}>
			<h5 className="text">OR</h5>
			<div
				className={`text ${styles.OAuthContainer}`}
				onClick={OAuthHalder}
			>
				<i className="fa fa-google" aria-hidden="true" />
				Sign In with Google
			</div>
		</div>
	);
}

const mapDispatchToProps = (dispatch: any) => ({
	authChangedHandler: (user?: firebase.User) =>
		dispatch(actions.authChangedHandler(user)),
});

export default connect(null, mapDispatchToProps)(GoogleAuth);
