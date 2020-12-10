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
	getContacts: (uid: string) => void;
}

function Contacts({ userData, contacts, isLoading, getContacts }: IProps) {
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (userData) {
			getContacts(userData.uid);
		}
	}, []);

	return (
		<div className={styles.Body} id="contacts">
			<Search query={query} setQuery={setQuery} />
			{isLoading ? (
				<div className={styles.LoaderContainer}>
					<Loader />
				</div>
			) : (
				contacts.map((contactData) => (
					<ContactCard userData={contactData} key={contactData.uid} />
				))
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

const mapDispatchToPRops = (dispatch: any) => ({
	getContacts: (uid: string) => dispatch(actions.getContacts(uid)),
});

export default connect(mapStateToProps, mapDispatchToPRops)(Contacts);
