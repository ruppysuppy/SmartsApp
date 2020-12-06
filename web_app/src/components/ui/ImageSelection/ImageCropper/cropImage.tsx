import { ICrop } from "../../../../shared/interfaces/interfaces";

const createImage = (url: string) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

export const getCroppedImg = async (imageSrc: string, crop: ICrop) => {
	const image = (await createImage(imageSrc)) as any;
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d")!;

	/* setting canvas width & height allows us to 
    resize from the original image resolution */
	canvas.width = 300;
	canvas.height = 300;

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		canvas.width,
		canvas.height
	);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			resolve(blob);
		}, "image/jpeg");
	});
};
