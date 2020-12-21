import React, { useState, ChangeEvent, createRef } from "react";
import { connect } from "react-redux";

import { storage } from "../../../firebase/firebase";
import { IState } from "../../../shared/interfaces/state";

import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import ImageCropper from "./ImageCropper/ImageCropper";

import styles from "./imageSelection.module.css";

interface IProps {
	setImgUrl: (url: string) => void;
	setUserDataFail: (message: string) => void;
	uid: string;
}

function ImageSelection({ uid, setImgUrl, setUserDataFail }: IProps) {
	const [blob, setBlob] = useState<Blob>();
	const [inputImg, setInputImg] = useState("");
	const [inputImgName, setInputImgName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [done, setDone] = useState(false);
	const inputRef = createRef<HTMLInputElement>();

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
		setInputImgName(file.name);
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
		const uploadTask = storage
			.ref("profilepic")
			.child(uid)
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

	const selectImageHandler = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		inputRef.current?.click();
	};

	return (
		<>
			<div className={`${styles.Container} mb-2`}>
				<div>
					<span className={styles.File}>
						<input
							ref={inputRef}
							className="text"
							type="file"
							accept="image/*"
							onChange={onInputChange}
							id="profile-pic"
						/>
					</span>
					<span className="d-inline-block mt-2">
						<Button
							btnType="SECONDARY"
							onClick={selectImageHandler}
						>
							Profile Picture
						</Button>
						<span className={`text text-break ${styles.ImageName}`}>
							{inputImgName ? inputImgName : "No file chosen"}
						</span>
					</span>
				</div>
				<span className={styles.AuxilaryContainer}>
					{inputImg &&
						(isLoading ? (
							<Loader />
						) : done ? (
							<i
								className={`material-icons ${styles.Tick}`}
								aria-hidden="true"
							>
								done
							</i>
						) : (
							<Button
								onClick={handleSubmitImage}
								btnType="SECONDARY"
							>
								Select
							</Button>
						))}
				</span>
			</div>
			{inputImg && <ImageCropper getBlob={getBlob} inputImg={inputImg} />}
		</>
	);
}

const mapStateToProps = (state: IState) => ({
	uid: state.auth.user!.uid,
});

export default connect(mapStateToProps)(ImageSelection);
