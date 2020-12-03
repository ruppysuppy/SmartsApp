import React, { lazy, Suspense, useEffect } from "react";
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
const UserDetails = lazy(
	() => import("./components/pages/UserDetails/UserDetails")
);
const Error404 = lazy(() => import("./components/pages/Error404/Error404"));

interface IProps {
	authChangedHandler: (user?: firebase.User) => void;
	getUserData: (uid: string) => void;
}

function App({ authChangedHandler, getUserData }: IProps) {
	useEffect(() => {
		auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		auth.onAuthStateChanged((user) => {
			if (user) {
				getUserData(user.uid);
			}
			authChangedHandler(user ? user : undefined);
		});
	}, []);

	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingScreen />}>
				<Layout>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/user-details" component={UserDetails} />
						<Route path="/logout" component={Logout} />
						<Route component={Error404} />
					</Switch>
				</Layout>
			</Suspense>
		</BrowserRouter>
	);
}

const mapDispatchToProps = (dispatch: any) => ({
	authChangedHandler: (user?: firebase.User) =>
		dispatch(actions.authChangedHandler(user)),
	getUserData: (uid: string) => dispatch(actions.getUserData(uid)),
});

export default connect(null, mapDispatchToProps)(App);
