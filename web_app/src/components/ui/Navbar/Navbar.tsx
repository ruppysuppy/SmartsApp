import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Navlinks from "./NavLinks/Navlinks";
import SideDrawer from "./SideDrawer/SideDrawer";
import ChatIcon from "../../../assets/img/ChatIcon.svg";
import MenuBtn from "../MenuBtn/MenuBtn";

import { IState } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

import styles from "./navbar.module.css";

interface IProps {
	isSideDrawerShown: boolean;
	location: {
		pathname: string;
	};
	clearSelectedContact: () => void;
	setIsSideDrawerShown: (value: boolean) => void;
}

function Navbar({
	isSideDrawerShown,
	location,
	clearSelectedContact,
	setIsSideDrawerShown,
}: IProps) {
	const { pathname } = location;

	const isInChat = !(pathname === "/" || pathname === "/chat");

	if (pathname === "/") {
		clearSelectedContact();
	}

	return (
		<>
			{isInChat && (
				<div className={styles.NavBar}>
					<div className={`container ${styles.NavContainer}`}>
						<div className={styles.NavIcon}>
							<Link to="/">
								<img src={ChatIcon} alt="Logo" />
								<span>SmartsApp</span>
							</Link>
						</div>
						<div
							className={`ml-auto my-auto ${styles.NavLinkHolder}`}
						>
							<Navlinks
								sidebarClose={() => setIsSideDrawerShown(false)}
							/>
						</div>
						<span className={styles.Toggler}>
							<MenuBtn
								onClick={() =>
									setIsSideDrawerShown(!isSideDrawerShown)
								}
								isCross={isSideDrawerShown}
							/>
						</span>
					</div>
				</div>
			)}
			<SideDrawer
				sidebarClose={() => setIsSideDrawerShown(false)}
				sidebarShown={isSideDrawerShown}
				shouldHideSidebar={isInChat}
			/>
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	isSideDrawerShown: state.ui.isSideDrawerShown,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	clearSelectedContact: () => dispatch(actions.clearSelectContact()),
	setIsSideDrawerShown: (value: boolean) =>
		dispatch(actions.setIsSideDrawerShown(value)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
