import React from "react";
import { Redirect } from "react-router";

interface Props {
	user?: object;
}

export default function Home({ user }: Props) {
	if (!user) {
		return <Redirect to="/login" />;
	}

	return <h1>HOME</h1>;
}
