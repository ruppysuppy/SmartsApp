import React from "react";

import Navbar from "../Navbar/Navbar";

interface Props {
	children?: React.ReactNode;
}

function Layout(props: Props) {
	const { children } = props;

	return (
		<>
			<Navbar />
			{children}
		</>
	);
}

export default Layout;
