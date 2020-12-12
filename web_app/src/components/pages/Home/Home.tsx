import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import Contacts from "./Contacts/Contacts";
import Chat from "./Chat/Chat";

import firebase from "../../../firebase/firebase";
import { IUserData, IState } from "../../../shared/interfaces/interfaces";

interface IProps {
	user?: firebase.User;
	userData?: IUserData;
	selectedContact?: number;
}

function Home({ user, userData, selectedContact }: IProps) {
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
	user: state.auth.user,
	userData: state.auth.userData,
	selectedContact: state.contact.selectedContact,
});

export default connect(mapStateToProps)(Home);
