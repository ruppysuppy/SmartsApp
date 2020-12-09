import React, { useState } from "react";
import { connect } from "react-redux";

import Search from "./Search/Search";
import ContactCard from "./Contact/ContactCard";

import { IState, IUserData } from "../../../../shared/interfaces/interfaces";

import styles from "./contacts.module.css";

interface IProps {
	userData?: IUserData;
}

function Contacts({ userData }: IProps) {
	const [query, setQuery] = useState("");

	return (
		<div className={styles.Body}>
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
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(Contacts);
