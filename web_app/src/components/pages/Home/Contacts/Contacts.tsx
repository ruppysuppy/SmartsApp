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
import sharedStyles from "../../../../shared/styles/auth.module.css";

interface IProps {
	userData?: IUserData;
	contacts: IContactData[];
	isLoading: boolean;
	error: string;
	getContacts: (uid: string, privateKey: string) => void;
	selectContact: (index: number) => void;
}

function Contacts({
	error,
	userData,
	contacts,
	isLoading,
	getContacts,
	selectContact,
}: IProps) {
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (userData) {
			getContacts(userData.uid, userData.privateKey);
		}
	}, []);

	const filteredContacts = query
		? contacts.filter((contact) => contact.username.includes(query))
		: contacts;

	const onClickHandler = (i: number) => {
		const uid = filteredContacts[i].uid;

		selectContact(contacts.findIndex((contact) => contact.uid == uid));
	};

	return (
		<div className={styles.Body} id="contacts">
			<Search query={query} setQuery={setQuery} />
			{error ? (
				<div className={styles.LoaderContainer}>
					<div className={sharedStyles.ErrorText}>
						<i className="fa fa-exclamation-circle d-inline-block pt-1" />
						<span className="d-inline-block pl-1 pb-2 text-wrap">
							{error}
						</span>
					</div>
				</div>
			) : isLoading ? (
				<div className={styles.LoaderContainer}>
					<Loader />
				</div>
			) : contacts.length === 0 ? (
				<div className={`text ${styles.LoaderContainer}`}>
					You don't have any contact
				</div>
			) : filteredContacts.length > 0 ? (
				filteredContacts.map((contactData, index) => (
					<ContactCard
						userData={contactData}
						key={contactData.uid}
						onClickHandler={() => onClickHandler(index)}
					/>
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
	error: state.contact.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	getContacts: (uid: string, privateKey: string) =>
		dispatch(actions.getContacts(uid, privateKey)),
	selectContact: (index: number) => dispatch(actions.selectContact(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
