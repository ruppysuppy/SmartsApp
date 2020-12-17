import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import MenuBtn from "../../../../ui/MenuBtn/MenuBtn";
import Input from "../../../../ui/Input/Input";

import { IState } from "../../../../../shared/interfaces/interfaces";
import * as actions from "../../../../../store/actions/actions";

import styles from "./search.module.css";

interface IProps {
	isSideDrawerShown: boolean;
	query: string;
	setQuery: (newQuery: string) => void;
	setIsSideDrawerShown: (value: boolean) => void;
}

function Search({
	isSideDrawerShown,
	query,
	setQuery,
	setIsSideDrawerShown,
}: IProps) {
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
	};

	return (
		<div className={styles.Body}>
			<span className={styles.InputHolder}>
				<Input
					val={query}
					onChangeFunc={(param: string) => setQuery(param)}
					placeholder="Search Contacts"
					inputType="TRANSPARENT"
				/>
			</span>
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
			<span className={styles.Toggler}>
				<MenuBtn
					isCross={isSideDrawerShown}
					isWhite={true}
					onClick={() => {
						setIsSideDrawerShown(!isSideDrawerShown);
					}}
				/>
			</span>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	isSideDrawerShown: state.ui.isSideDrawerShown,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	setIsSideDrawerShown: (value: boolean) =>
		dispatch(actions.setIsSideDrawerShown(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
