import React from "react";

import Navbar from "../Navbar/Navbar";

import styles from "./layout.module.css";

interface IProps {
	children?: React.ReactNode;
	user?: object;
}

function Layout({ children, user }: IProps) {
	return (
		<>
			<Navbar />
			{user && <span className={styles.Spacer} />}
			{user ? <div className="container">{children}</div> : children}
		</>
	);
}

export default Layout;
