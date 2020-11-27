import React, { useState } from "react";
import { Link } from "react-router-dom";

import AuthBackground from "../../ui/AuthBackground/AuthBackground";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

import styles from "../../../shared/auth/auth.module.css";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<AuthBackground>
			<div className={styles.Body}>
				<h1>LOGIN</h1>
				<hr className="mt-0" />
				<form className="py-2">
					<Input
						placeholder="Email"
						val={email}
						onChangeFunc={(email: string) => setEmail(email)}
					/>
					<Input
						placeholder="Password"
						val={password}
						onChangeFunc={(password: string) =>
							setPassword(password)
						}
						type="password"
					/>
					<p className={styles.RedirectText}>
						Not a member yet? <Link to="/register">Register</Link>
					</p>
					<Button>Login</Button>
				</form>
			</div>
		</AuthBackground>
	);
}
