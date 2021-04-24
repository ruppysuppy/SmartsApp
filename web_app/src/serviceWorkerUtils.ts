// DEFFERED PROMPT
let deferredPrompt: any;

export const storeDeferredPrompt = (event: Event) => {
	deferredPrompt = event;
};

export const promptInstallation = () => {
	if (!deferredPrompt) {
		return;
	}
	deferredPrompt.prompt();
};
