import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AuthBackground from "../../ui/AuthBackground/AuthBackground";
import Button from "../../ui/Button/Button";
import GoogleAuth from "../../ui/GoogleAuth/GoogleAuth";
import Input from "../../ui/Input/Input";
import Loader from "../../ui/Loader/Loader";

import firebase from "../../../firebase/firebase";
import { IState } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

import styles from "../../../shared/styles/sharedStyles.module.css";

interface IProps {
	error: string;
	isLoading: boolean;
	user?: firebase.User;
	emailAuth: (email: string, password: string) => void;
	emailAuthFail: (message: string) => void;
}

function Login({ user, isLoading, error, emailAuth, emailAuthFail }: IProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		emailAuthFail("");
	}, []);

	const onSubmitHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		if (email.length === 0) {
			emailAuthFail("Enter a valid Email Address");
			return;
		}
		if (password.length < 6) {
			emailAuthFail("Password length must be greater than 6");
			return;
		}
		emailAuth(email, password);
	};

	if (user) {
		return <Redirect to="/" />;
	}

	return (
		<AuthBackground>
			<div className={styles.Body}>
				<h1 className="text">LOGIN</h1>
				<hr className="mt-0" />
				<form className="py-2" onSubmit={onSubmitHandler}>
					<Input
						placeholder="Email"
						val={email}
						onChangeFunc={(email: string) => setEmail(email)}
						type="email"
					/>
					<Input
						placeholder="Password"
						val={password}
						onChangeFunc={(password: string) =>
							setPassword(password)
						}
						type="password"
					/>
					<p className={`text ${styles.RedirectText}`}>
						Not a member yet? <Link to="/register">Register</Link>
					</p>
					{error && (
						<>
							<div className={styles.ErrorText}>
								<i className="fa fa-exclamation-circle d-inline-block pt-1" />
								<span className="d-inline-block pl-1 pb-2 text-wrap">
									{error}
								</span>
							</div>
						</>
					)}
					{isLoading ? <Loader /> : <Button>Login</Button>}
				</form>
				<GoogleAuth />
			</div>
		</AuthBackground>
	);
}

const mapStateToProps = (state: IState) => ({
	error: state.auth.error,
	isLoading: state.auth.isLoading,
	user: state.auth.user,
});

const mapDispatchToProps = (dispatch: any) => ({
	emailAuth: (email: string, password: string) =>
		dispatch(actions.emailAuth(email, password)),
	emailAuthFail: (message: string) =>
		dispatch(actions.emailAuthFail(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
