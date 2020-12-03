# Smartsapp

<div align="center">
    <img src="./readme_img/logo.svg" style="width: 200px" />
</div>

A fully **cross-platform messenger** app with **End to End Encryption (E2EE)**.

## Platforms Supported

1. **Desktop:** Windows, Linux, MacOS
2. **Mobile:** Android, iOS
3. **Website:** Any device with a browser

## Back-end Setup

The back-end of the app is handled by `Firebase`.

### Basic Setup

1. Go to firebase console and create a new project with the name `Smartsapp`
2. Enable `Google Analylitics` [if you want to view the analytics of the project]

### App Setup

1. Create an `App` for the project from the overview page
2. Copy and paste the configurations in the required location (given in the readme of the respective apps)

### Auth Setup

1. Go to the project `Authentication` section
2. Select `Sign-in method` tab
3. Enable `Email/Password` and `Google` sign in

### Firestore Setup

1. Go to the project `Firestore` section
2. Create firestore provisions for the project (choose the server nearest to your location)

### Storage Setup

1. Go to the project `Storage` section
2. Create storage provisions for the project (choose the server nearest to your location)

### Note

Running the E2EE Key Generator Server is necessary for all Platform
