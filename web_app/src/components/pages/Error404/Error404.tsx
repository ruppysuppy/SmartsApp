import React from "react";

import sharedStyles from "../../../shared/styles/auth.module.css";

export default function Error404() {
	return (
		<div className={sharedStyles.OverflowContainer}>
			<div className="container">
				<div className="my-5 py-1" />
				<h1 className="text">Error 404</h1>
				<hr className="mt-0" />
				<h2 className="text">It seems like you are lost! 😵😨</h2>
			</div>
		</div>
	);
}
