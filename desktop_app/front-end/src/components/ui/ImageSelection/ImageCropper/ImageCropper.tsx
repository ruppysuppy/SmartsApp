import React, { useState } from "react";
import Cropper from "react-easy-crop";

import { getCroppedImg } from "./cropImage";
import { ICrop } from "../../../../shared/interfaces/interfaces";

import styles from "./cropper.module.css";

interface IProps {
	getBlob: any;
	inputImg: string;
}

export default function ImageCropper({ getBlob, inputImg }: IProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const onCropComplete = async (_: any, croppedAreaPixels: ICrop) => {
		const croppedImage = await getCroppedImg(inputImg, croppedAreaPixels);
		getBlob(croppedImage);
	};

	return (
		<div className={styles.Cropper}>
			<Cropper
				image={inputImg}
				crop={crop}
				zoom={zoom}
				aspect={1}
				onCropChange={setCrop}
				onCropComplete={onCropComplete}
				onZoomChange={setZoom}
			/>
		</div>
	);
}
