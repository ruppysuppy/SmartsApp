import React from "react";

import Navbar from "../Navbar/Navbar";

import styles from "./layout.module.css";

interface Props {
	children?: React.ReactNode;
	user?: object;
}

function Layout({ children, user }: Props) {
	return (
		<>
			<Navbar />
			{user && <span className={styles.Spacer} />}
			{user ? <div className="container">{children}</div> : children}
		</>
	);
}

export default Layout;
