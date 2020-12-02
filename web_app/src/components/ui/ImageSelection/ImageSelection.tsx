import React, { useState, ChangeEvent } from "react";
import { v4 as uuid } from "uuid";

import firebase from "../../../firebase/firebase";

import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import ImageCropper from "./ImageCropper/ImageCropper";

import styles from "./imageSelection.module.css";

interface IProps {
	setImgUrl: (url: string) => void;
	setUserDataFail: (message: string) => void;
}

export default function ImageSelection({ setImgUrl, setUserDataFail }: IProps) {
	const [blob, setBlob] = useState<Blob>();
	const [inputImg, setInputImg] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [done, setDone] = useState(false);

	const getBlob = (blob: any) => {
		setBlob(blob);
	};

	const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setDone(false);
		setImgUrl("");
		const files = event.currentTarget.files;
		if (!files) {
			return;
		}
		const file = files[0];
		const reader = new FileReader();

		reader.addEventListener(
			"load",
			() => {
				setInputImg(reader.result as string);
			},
			false
		);

		if (file) {
			reader.readAsDataURL(file);
		}
	};

	const handleSubmitImage = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		setIsLoading(true);
		const uploadTask = firebase
			.storage()
			.ref("images")
			.child(uuid())
			.put(blob!, { contentType: blob!.type });

		uploadTask.on(
			"state_changed",
			function (_) {},
			function (error) {
				setIsLoading(false);
				setUserDataFail(error.message);
			},
			function () {
				uploadTask.snapshot.ref
					.getDownloadURL()
					.then(function (downloadURL) {
						setIsLoading(false);
						setDone(true);
						setImgUrl(downloadURL);
					});
			}
		);
	};

	return (
		<>
			<div className="d-flex align-items-center mb-2">
				<input type="file" accept="image/*" onChange={onInputChange} />
				{inputImg &&
					(isLoading ? (
						<span className="d-inline-block ml-auto">
							<Loader />
						</span>
					) : done ? (
						<i
							className={`fa fa-check d-inline-block ml-auto ${styles.Tick}`}
							aria-hidden="true"
						/>
					) : (
						<Button
							className="d-inline-block ml-auto"
							onClick={handleSubmitImage}
							btnType="SECONDARY"
						>
							Select
						</Button>
					))}
			</div>
			{inputImg && <ImageCropper getBlob={getBlob} inputImg={inputImg} />}
		</>
	);
}
