const { ipcRenderer } = require('electron')

ipcRenderer.on("darkMode:get", (_, isEnabled) => {
    if (isEnabled) {
        document.querySelector("body").classList.add("dark");
    }
})