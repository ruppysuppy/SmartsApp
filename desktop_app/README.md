# Smartsapp Desktop App

Desktop App for Smartsapp messenger.

## Tools used

1. **Electron:** For converting web-app to desktop app
2. **Firebase:** For DataBase & Auth
3. **React:** To create the Single Page App
4. **React-Router:** For Routing
5. **Redux:** For State Management
6. **TypeScript:** For strict type checking

## How to Use

To use the project follow the steps given below:

1. Install the necessary modules with the command `npm install`
2. Setup Firebase Project
3. Add your configuration in `/front-end/src/firebase/config.ts` as (the data details will be available at the firebase console when you create a `Web App`)

    ```javascript
    const firebaseConfig = {
    	apiKey: "YOUR-API-KEY",
    	authDomain: "YOUR-AUTH-DOMAIN.firebaseapp.com",
    	databaseURL: "YOUR-DATABASE-URL.firebaseio.com",
    	projectId: "YOUR-PROJECT-ID",
    	storageBucket: "YOUR-STORAGE-BUCKET.appspot.com",
    	messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    	appId: "YOUR-APP-ID",
    	measurementId: "YOUR-MEASUREMENT-ID",
    };

    export default firebaseConfig;
    ```

4. Use `npm run watch` to run the TypeScript Complier
5. Perform either of the following based on the development status of the app you are using:
    - **PRODUCTION (default)**: Use `npm run build-front-end` to build the react app
    - **DEVELOPMENT**: Use `npm run start-front-end` to start the react app
6. Use `npm start` to run the electron app

## Packaging App

1. Make sure the app is in **PRODUCTION** mode
2. Make sure the javascript files have been generated (Use `npm run watch` at least once or use `tsc`)
3. Use `npm run build-front-end` to package the front-end react app
4. Use `npm run build-installer` to package the app
