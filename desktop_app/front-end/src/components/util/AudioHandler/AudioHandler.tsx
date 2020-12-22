import React, { createRef, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import * as actions from "../../../store/actions/actions";
import { IState } from "../../../shared/interfaces/interfaces";

const receive = require("../../../assets/audio/receive.mp3");
const send = require("../../../assets/audio/send.mp3");

interface IProps {
	playReceive: boolean;
	playSend: boolean;
	resetPlayReceive: () => void;
	resetPlaySend: () => void;
}

function AudioHandler({
	playReceive,
	playSend,
	resetPlayReceive,
	resetPlaySend,
}: IProps) {
	const receiveRef = createRef<HTMLAudioElement>();
	const sendRef = createRef<HTMLAudioElement>();

	useEffect(() => {
		if (playReceive && receiveRef.current) {
			receiveRef.current!.play();
			resetPlayReceive();
		}
	}, [playReceive]);
	useEffect(() => {
		if (playSend && sendRef.current) {
			sendRef.current!.play();
			resetPlaySend();
		}
	}, [playSend]);

	return (
		<>
			<audio ref={receiveRef}>
				<source src={receive.default} type="audio/mpeg" />
			</audio>
			<audio ref={sendRef}>
				<source src={send.default} type="audio/mpeg" />
			</audio>
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	playReceive: state.contact.shouldPlayReceiveAudio,
	playSend: state.contact.shouldPlaySendAudio,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	resetPlayReceive: () => dispatch(actions.setShouldPlayReceiveAudio(false)),
	resetPlaySend: () => dispatch(actions.setShouldPlaySendAudio(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioHandler);
