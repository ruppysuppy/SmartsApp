import React from "react";
import { Redirect } from "react-router";

interface IProps {
	user?: object;
}

export default function Home({ user }: IProps) {
	if (!user) {
		return <Redirect to="/login" />;
	}

	return <h1>HOME</h1>;
}
