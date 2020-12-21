import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./components/ui/Layout/Layout";
import LoadingScreen from "./components/pages/LoadingScreen/LoadingScreen";
import Logout from "./components/pages/Logout/Logout";

import firebase, { auth } from "./firebase/firebase";
import { IState } from "./shared/interfaces/interfaces";
import * as actions from "./store/actions/actions";

const Home = lazy(() => import("./components/pages/Home/Home"));
const Login = lazy(() => import("./components/pages/Login/Login"));
const Register = lazy(() => import("./components/pages/Register/Register"));
const Settings = lazy(() => import("./components/pages/Settings/Settings"));
const UserDetails = lazy(
	() => import("./components/pages/UserDetails/UserDetails")
);
const Error404 = lazy(() => import("./components/pages/Error404/Error404"));

interface IProps {
	isDarkModeEnabled: boolean;
	authChangedHandler: (user?: firebase.User) => void;
	getUserData: (uid: string) => Promise<void>;
	setIsDarkModeEnabled: (value: boolean) => void;
}

function App({
	isDarkModeEnabled,
	authChangedHandler,
	getUserData,
	setIsDarkModeEnabled,
}: IProps) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		auth.onAuthStateChanged((user) => {
			setIsLoading(true);
			if (!user) {
				setIsLoading(false);
				return;
			}
			getUserData(user.uid).then(() => setIsLoading(false));
			authChangedHandler(user ? user : undefined);
		});
		const isDarkModeEnabled = window.localStorage.getItem(
			"isDarkModeEnabled"
		);
		if (isDarkModeEnabled === "true") {
			setIsDarkModeEnabled(true);
		} else {
			setIsDarkModeEnabled(false);
		}
	}, []);

	return (
		<div className={isDarkModeEnabled ? "dark" : ""} id="root-container">
			{isLoading ? (
				<LoadingScreen />
			) : (
				<BrowserRouter>
					<Suspense fallback={<LoadingScreen />}>
						<Layout>
							<Switch>
								<Route path="/" exact component={Home} />
								<Route path="/chat" exact component={Home} />
								<Route path="/login" component={Login} />
								<Route path="/logout" component={Logout} />
								<Route path="/register" component={Register} />
								<Route path="/settings" component={Settings} />
								<Route
									path="/user-details"
									component={UserDetails}
								/>
								<Route component={Error404} />
							</Switch>
						</Layout>
					</Suspense>
				</BrowserRouter>
			)}
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	isDarkModeEnabled: state.ui.isDarkModeEnabled,
});

const mapDispatchToProps = (dispatch: any) => ({
	authChangedHandler: (user?: firebase.User) =>
		dispatch(actions.authChangedHandler(user)),
	getUserData: async (uid: string) =>
		await dispatch(actions.getUserData(uid)),
	setIsDarkModeEnabled: (value: boolean) =>
		dispatch(actions.setIsDarkModeEnabled(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
