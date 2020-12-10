import React, { useState } from "react";
import { connect } from "react-redux";

import Search from "./Search/Search";
import ContactCard from "./Contact/ContactCard";
import AddBtn from "./AddBtn/AddBtn";

import { IState, IUserData } from "../../../../shared/interfaces/interfaces";

import styles from "./contacts.module.css";

interface IProps {
	userData?: IUserData;
}

function Contacts({ userData }: IProps) {
	const [query, setQuery] = useState("");

	return (
		<div className={styles.Body} id="contacts">
			<Search query={query} setQuery={setQuery} />
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			{userData && <ContactCard userData={userData} />}
			<span className={styles.BtnHolder}>
				<AddBtn />
			</span>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(Contacts);
