import React, { useState } from "react";
import { Link } from "react-router-dom";

import AuthBackground from "../../ui/AuthBackground/AuthBackground";
import Input from "../../ui/Input/Input";

import styles from "../../common/auth/auth.module.css";

export default function Register() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<AuthBackground>
			<div className={styles.Body}>
				<h1>REGISTER</h1>
				<hr className="mt-0" />
				<form className="py-2">
					<Input
						placeholder="Email"
						val={email}
						onChangeFunc={(email: string) => setEmail(email)}
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
				</form>
			</div>
		</AuthBackground>
	);
}
