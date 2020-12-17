import React from "react";
import { Link } from "react-router-dom";

import Navlinks from "../NavLinks/Navlinks";

import styles from "./sidedrawer.module.css";

import ChatIcon from "../../../../assets/img/ChatIcon.svg";

interface IProps {
	shouldHideSidebar: boolean;
	sidebarShown: boolean;
	sidebarClose: () => void;
}

function SideDrawer({ shouldHideSidebar, sidebarShown, sidebarClose }: IProps) {
	return (
		<>
			<div
				className={`${styles.Backdrop} ${
					sidebarShown ? styles.BackdropOpen : styles.BackdropClose
				} ${shouldHideSidebar && styles.HideSidebar}`}
				onClick={sidebarClose}
			></div>
			<div
				className={`${styles.SideBarBody} ${
					sidebarShown
						? styles.SideBarBodyOpen
						: styles.SideBarBodyClose
				} ${shouldHideSidebar && styles.HideSidebar}`}
			>
				<div className={`container ${styles.SideDrawerIcon}`}>
					<Link to="/" onClick={sidebarClose}>
						<img src={ChatIcon} alt="SmartsApp" />
					</Link>
				</div>
				<div className="container px-3">
					<Navlinks sidebarClose={sidebarClose} isSideBar={true} />
				</div>
			</div>
		</>
	);
}

export default SideDrawer;
