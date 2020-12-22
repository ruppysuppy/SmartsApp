import React from "react";

import styles from "./googleAuth.module.css";

function GoogleAuth() {
	return (
		<div className={styles.Body}>
			<h5 className="text">OR</h5>
			<div className={`text ${styles.OAuthContainer}`}>
				<i className="fa fa-google" aria-hidden="true" />
				Sign In with Google
			</div>
		</div>
	);
}

export default GoogleAuth;
