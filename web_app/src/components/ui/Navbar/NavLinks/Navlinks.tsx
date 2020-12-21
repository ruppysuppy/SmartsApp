import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import firebase from "../../../../firebase/firebase";
import { IState, IUserData } from "../../../../shared/interfaces/interfaces";

import styles from "./navlinks.module.css";

interface IProps {
	isSideBar?: boolean;
	pathname: string;
	user?: firebase.User;
	userData?: IUserData;
	sidebarClose: () => void;
}

function Navlinks({
	isSideBar,
	pathname,
	userData,
	user,
	sidebarClose,
}: IProps) {
	return (
		<div
			className={`ml-auto my-auto ${
				isSideBar ? styles.SideLinkHolder : styles.NavLinkHolder
			}`}
		>
			{user ? (
				<>
					<NavLink
						exact
						to="/"
						className={isSideBar ? styles.SideLink : styles.NavLink}
						activeClassName={styles.NavLinkActive}
						isActive={() => ["/", "/chat"].includes(pathname)}
						onClick={sidebarClose}
					>
						Chats
						<span className={styles.Spacer} />
						<i className="material-icons">chat</i>
					</NavLink>
					{userData && (
						<NavLink
							exact
							to="/settings"
							className={
								isSideBar ? styles.SideLink : styles.NavLink
							}
							activeClassName={styles.NavLinkActive}
							onClick={sidebarClose}
						>
							Settings
							<span className={styles.Spacer} />
							<i className="material-icons">settings</i>
						</NavLink>
					)}
					<NavLink
						exact
						to="/logout"
						className={isSideBar ? styles.SideLink : styles.NavLink}
						activeClassName={styles.NavLinkActive}
						onClick={sidebarClose}
					>
						Log Out
						<span className={styles.Spacer} />
						<i className="material-icons">power_settings_new</i>
					</NavLink>
				</>
			) : (
				<>
					<NavLink
						exact
						to="/login"
						className={isSideBar ? styles.SideLink : styles.NavLink}
						activeClassName={styles.NavLinkActive}
						onClick={sidebarClose}
					>
						Log In
						<span className={styles.Spacer} />
						<i className="material-icons">login</i>
					</NavLink>
					<NavLink
						exact
						to="/register"
						className={isSideBar ? styles.SideLink : styles.NavLink}
						activeClassName={styles.NavLinkActive}
						onClick={sidebarClose}
					>
						Register
						<span className={styles.Spacer} />
						<i className="material-icons">person_add</i>
					</NavLink>
				</>
			)}
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	user: state.auth.user,
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(Navlinks);
