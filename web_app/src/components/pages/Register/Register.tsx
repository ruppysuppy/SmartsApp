import React, { useState } from "react";

import AuthBackground from "../../ui/AuthBackground/AuthBackground";
import Input from "../../ui/Input/Input";

import styles from "./register.module.css";

export default function Register() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<AuthBackground>
			<div className={styles.Body}>
				<h1>REGISTER</h1>
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
					{/* <button>Submit</button> */}
				</form>
			</div>
		</AuthBackground>
	);
}
