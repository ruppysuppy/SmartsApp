import React from "react";
import { Link } from "react-router-dom";

import Navlinks from "../NavLinks/Navlinks";

import style from "./sidedrawer.module.css";

import ChatIcon from "../../../../assets/img/ChatIcon.svg";

interface Props {
	sidebarClose: () => void;
	sidebarShown: boolean;
}

function SideDrawer({ sidebarClose, sidebarShown }: Props) {
	return (
		<>
			<div
				className={`${style.Backdrop} ${
					sidebarShown ? style.BackdropOpen : style.BackdropClose
				}`}
				onClick={sidebarClose}
			></div>
			<div
				className={`${style.SideBarBody} ${
					sidebarShown
						? style.SideBarBodyOpen
						: style.SideBarBodyClose
				}`}
			>
				<div className={`container ${style.SideDrawerIcon}`}>
					<Link to="/" onClick={sidebarClose}>
						<img src={ChatIcon} alt="SmartsApp" />
					</Link>
				</div>
				<div className="container px-3">
					<Navlinks sidebarClose={sidebarClose} />
				</div>
			</div>
		</>
	);
}

export default SideDrawer;
