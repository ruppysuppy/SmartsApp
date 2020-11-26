# Smartsapp Web App

Web App for Smartsapp messenger.

## Tools used

1. **Firebase:** For DataBase & Auth
2. **React:** To create the Single Page App
3. **React-Router:** For Routing
4. **Redux:** For State Management
5. **TypeScript:** For strict type checking

## How to Use

To use the project follow the steps given below:

1. Install the necessary modules with the command `npm install`
2. Setup Firebase Project
3. Add your configuration in `/src/firebase/config.ts` as

    ```javascript
    const firebaseConfig = {
    	apiKey: "API-KEY",
    	authDomain: "AUTH-DOMAIN.firebaseapp.com",
    	databaseURL: "DATABASE-URL.firebaseio.com",
    	projectId: "PROJECT-ID",
    	storageBucket: "STORAGE-BUCKET.appspot.com",
    	messagingSenderId: "MESSAGING-SENDER-ID",
    	appId: "APP-ID",
    	measurementId: "MEASUREMENT-ID",
    };

    export default firebaseConfig;
    ```

4. Use `npm start` to run the react app
