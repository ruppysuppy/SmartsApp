import React, { useState } from "react";

import Input from "../../../../ui/Input/Input";
import Modal from "../../../../ui/Modal/Modal";

import styles from "./addBtn.module.css";

export default function AddBtn() {
	const [username, setUsername] = useState("");
	const [isShown, setIsShown] = useState(false);

	return (
		<>
			<div
				className={styles.Btn}
				id="add-contacts-btn"
				onClick={() => setIsShown(true)}
			>
				<i className="material-icons">group_add</i>
			</div>
			<Modal
				title="Add User To Contacts"
				isShown={isShown}
				changeVisibility={(value: boolean) => setIsShown(value)}
			>
				<div className={styles.InputHolder}>
					<Input
						placeholder="username"
						val={username}
						onChangeFunc={(param: string) => setUsername(param)}
					/>
				</div>
			</Modal>
		</>
	);
}
