import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Search from "./Search/Search";
import ContactCard from "./Contact/ContactCard";
import AddBtn from "./AddBtn/AddBtn";
import Loader from "../../../ui/Loader/Loader";

import {
	IState,
	IUserData,
	IContactData,
} from "../../../../shared/interfaces/interfaces";
import * as actions from "../../../../store/actions/actions";

import styles from "./contacts.module.css";

interface IProps {
	userData?: IUserData;
	contacts: IContactData[];
	isLoading: boolean;
	getContacts: (uid: string, privateKey: string) => void;
}

function Contacts({ userData, contacts, isLoading, getContacts }: IProps) {
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (userData) {
			getContacts(userData.uid, userData.privateKey);
		}
	}, []);

	const filteredContacts = query
		? contacts.filter((contact) => contact.username.includes(query))
		: contacts;

	return (
		<div className={styles.Body} id="contacts">
			<Search query={query} setQuery={setQuery} />
			{isLoading ? (
				<div className={styles.LoaderContainer}>
					<Loader />
				</div>
			) : contacts.length === 0 ? (
				<div className={`text ${styles.LoaderContainer}`}>
					You don't have any contact
				</div>
			) : filteredContacts.length > 0 ? (
				filteredContacts.map((contactData) => (
					<ContactCard userData={contactData} key={contactData.uid} />
				))
			) : (
				<div className={`text ${styles.LoaderContainer}`}>
					No match found
				</div>
			)}
			<span className={styles.BtnHolder}>
				<AddBtn />
			</span>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	userData: state.auth.userData,
	contacts: state.contact.contacts,
	isLoading: state.contact.isLoading,
});

const mapDispatchToProps = (dispatch: any) => ({
	getContacts: (uid: string, privateKey: string) =>
		dispatch(actions.getContacts(uid, privateKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
