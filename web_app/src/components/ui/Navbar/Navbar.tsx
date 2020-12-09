import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import Navlinks from "./NavLinks/Navlinks";
import SideDrawer from "./SideDrawer/SideDrawer";

import { IState } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

import ChatIcon from "../../../assets/img/ChatIcon.svg";
import styles from "./navbar.module.css";
import MenuBtn from "../MenuBtn/MenuBtn";

interface IProps {
	location: {
		pathname: string;
	};
	isSideDrawerShown: boolean;
	setIsSideDrawerShown: (value: boolean) => void;
}

function Navbar({ location, isSideDrawerShown, setIsSideDrawerShown }: IProps) {
	const { pathname } = location;

	return (
		<>
			{pathname !== "/" && (
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
			/>
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	isSideDrawerShown: state.ui.isSideDrawerShown,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	setIsSideDrawerShown: (value: boolean) =>
		dispatch(actions.setIsSideDrawerShown(value)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
