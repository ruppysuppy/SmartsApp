import React from "react";

import styles from "./search.module.css";

interface IProps {
	query: string;
	setQuery: (newQuery: string) => void;
}

export default function Search({ query, setQuery }: IProps) {
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
	};

	return (
		<div className={`mt-5 ${styles.Body}`}>
			<input
				type="text"
				placeholder="Search Contacts"
				value={query}
				onChange={onChangeHandler}
			/>
			{query ? (
				<i
					className={`material-icons ${styles.CloseBtn}`}
					onClick={() => setQuery("")}
				>
					close
				</i>
			) : (
				<i className="material-icons">search</i>
			)}
		</div>
	);
}
