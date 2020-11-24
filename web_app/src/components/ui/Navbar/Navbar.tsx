import React, { useState } from "react";
import { Link } from "react-router-dom";

import ChatIcon from "../../../assets/img/ChatIcon.svg";
import styles from "./navbar.module.css";

export default function Navbar() {
	const [sidebarShown, setSidebarShown] = useState(false);

	return (
		<div className={styles.NavBar}>
			<div className={`container ${styles.NavContainer}`}>
				<div className={styles.NavIcon}>
					<Link to="/">
						<img src={ChatIcon} alt="Logo" />
						<span>SmartsApp</span>
					</Link>
				</div>
				<div className={`ml-auto my-auto ${styles.NavLinkHolder}`}>
					<h5>Nav Links</h5>
				</div>
				<button
					className={`ml-auto my-auto ${styles.Toggler}`}
					onClick={() => setSidebarShown(!sidebarShown)}
				>
					<div
						className={`${styles.Bar1} ${
							sidebarShown && styles.CrossBar1
						}`}
					/>
					<div
						className={`${styles.Bar2} ${
							sidebarShown && styles.CrossBar2
						}`}
					/>
					<div
						className={`${styles.Bar3} ${
							sidebarShown && styles.CrossBar3
						}`}
					/>
				</button>
			</div>
		</div>
	);
}
