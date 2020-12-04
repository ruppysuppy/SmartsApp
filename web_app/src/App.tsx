import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./components/ui/Layout/Layout";
import LoadingScreen from "./components/pages/LoadingScreen/LoadingScreen";
import Logout from "./components/pages/Logout/Logout";

import firebase, { auth } from "./firebase/firebase";
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
	authChangedHandler: (user?: firebase.User) => void;
	getUserData: (uid: string) => Promise<void>;
}

function App({ authChangedHandler, getUserData }: IProps) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		auth.onAuthStateChanged((user) => {
			if (!user) {
				setIsLoading(false);
				return;
			}
			getUserData(user.uid).then(() => setIsLoading(false));
			authChangedHandler(user ? user : undefined);
		});
	}, []);

	return (
		<div id="root-container">
			{isLoading ? (
				<LoadingScreen />
			) : (
				<BrowserRouter>
					<Suspense fallback={<LoadingScreen />}>
						<Layout>
							<Switch>
								<Route path="/" exact component={Home} />
								<Route path="/login" component={Login} />
								<Route path="/register" component={Register} />
								<Route path="/settings" component={Settings} />
								<Route
									path="/user-details"
									component={UserDetails}
								/>
								<Route path="/logout" component={Logout} />
								<Route component={Error404} />
							</Switch>
						</Layout>
					</Suspense>
				</BrowserRouter>
			)}
		</div>
	);
}

const mapDispatchToProps = (dispatch: any) => ({
	authChangedHandler: (user?: firebase.User) =>
		dispatch(actions.authChangedHandler(user)),
	getUserData: async (uid: string) =>
		await dispatch(actions.getUserData(uid)),
});

export default connect(null, mapDispatchToProps)(App);
