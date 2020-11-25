import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./navlinks.module.css";

interface Props {
	user?: object;
}

export default function Navlinks({ user }: Props) {
	return (
		<div className={`ml-auto my-auto ${styles.NavLinkHolder}`}>
			{user ? (
				<>
					<NavLink
						exact
						to="/"
						className={styles.NavLink}
						activeClassName={styles.NavLinkActive}
					>
						Chats
						<span className={styles.Spacer} />
						<i className="fa fa-comments" aria-hidden="true" />
					</NavLink>
					<NavLink
						exact
						to="/settings"
						className={styles.NavLink}
						activeClassName={styles.NavLinkActive}
					>
						Settings
						<span className={styles.Spacer} />
						<i className="fa fa-cogs" aria-hidden="true" />
					</NavLink>
					<NavLink
						exact
						to="/logout"
						className={styles.NavLink}
						activeClassName={styles.NavLinkActive}
					>
						Log Out
						<span className={styles.Spacer} />
						<i className="fa fa-sign-out" aria-hidden="true" />
					</NavLink>
				</>
			) : (
				<>
					<NavLink
						exact
						to="/login"
						className={styles.NavLink}
						activeClassName={styles.NavLinkActive}
					>
						Log In
						<span className={styles.Spacer} />
						<i className="fa fa-sign-in" aria-hidden="true" />
					</NavLink>
					<NavLink
						exact
						to="/register"
						className={styles.NavLink}
						activeClassName={styles.NavLinkActive}
					>
						Register
						<span className={styles.Spacer} />
						<i className="fa fa-user-plus" aria-hidden="true" />
					</NavLink>
				</>
			)}
		</div>
	);
}
