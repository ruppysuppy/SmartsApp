import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import Chat from "./Chat/Chat";
import Contacts from "./Contacts/Contacts";

import firebase from "../../../firebase/firebase";
import { IState, IUserData } from "../../../shared/interfaces/interfaces";

interface IProps {
	selectedContact?: number;
	user?: firebase.User;
	userData?: IUserData;
}

function Home({ selectedContact, user, userData }: IProps) {
	if (!user) {
		return <Redirect to="/login" />;
	}
	if (!userData) {
		return <Redirect to="/user-details" />;
	}

	return (
		<>
			<Contacts />
			{selectedContact !== undefined && <Chat />}
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	selectedContact: state.contact.selectedContact,
	user: state.auth.user,
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(Home);
