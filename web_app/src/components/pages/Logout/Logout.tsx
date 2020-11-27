import React, { useEffect } from "react";
import { Redirect } from "react-router";

import { auth } from "../../../firebase/firebase";

function Logout() {
	useEffect(() => {
		auth.signOut();
	}, []);

	return <Redirect to="/" />;
}

export default Logout;
