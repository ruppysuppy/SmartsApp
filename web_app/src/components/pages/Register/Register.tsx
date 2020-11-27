import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AuthBackground from "../../ui/AuthBackground/AuthBackground";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import Loader from "../../ui/Loader/Loader";

import firebase from "../../../firebase/firebase";
import { IState } from "../../../shared/interfaces/Interfaces";
import * as actions from "../../../store/actions/actions";

import styles from "../../../shared/auth/auth.module.css";

interface IProps {
	user?: firebase.User;
	isLoading: boolean;
	error: string;
	emailRegister: (email: string, username: string, password: string) => void;
}

function Register({ user, isLoading, error, emailRegister }: IProps) {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const onSubmitHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		emailRegister(email, username, password);
	};

	if (user) {
		return <Redirect to="/" />;
	}

	return (
		<AuthBackground>
			<div className={styles.Body}>
				<h1>REGISTER</h1>
				<hr className="mt-0" />
				<form className="py-2" onSubmit={onSubmitHandler}>
					<Input
						placeholder="Email"
						val={email}
						onChangeFunc={(email: string) => setEmail(email)}
						type="email"
					/>
					<Input
						placeholder="Username"
						val={username}
						onChangeFunc={(email: string) => setUsername(email)}
					/>
					<Input
						placeholder="Password"
						val={password}
						onChangeFunc={(password: string) =>
							setPassword(password)
						}
						type="password"
					/>
					<Input
						placeholder="Confirm Password"
						val={confirmPassword}
						onChangeFunc={(password: string) =>
							setConfirmPassword(password)
						}
						type="password"
					/>
					<p className={styles.RedirectText}>
						Already a member? <Link to="/login">Login</Link>
					</p>
					{error && (
						<>
							<div className={styles.ErrorText}>
								<i className="fa fa-exclamation-circle" />
								{error}
							</div>
						</>
					)}
					{isLoading ? <Loader /> : <Button>Register</Button>}
				</form>
			</div>
		</AuthBackground>
	);
}

const mapStateToProps = (state: IState) => ({
	user: state.auth.user,
	isLoading: state.auth.isLoading,
	error: state.auth.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	emailRegister: (email: string, username: string, password: string) =>
		dispatch(actions.emailRegister(email, username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
