import React from "react";

import Navbar from "../Navbar/Navbar";

import styles from "./layout.module.css";

interface Props {
	children?: React.ReactNode;
}

function Layout(props: Props) {
	const { children } = props;

	return (
		<>
			<Navbar />
			<span className={styles.Spacer} />
			<div className="container">{children}</div>
		</>
	);
}

export default Layout;
