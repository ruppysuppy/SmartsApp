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
3. Add your configuration in `/src/firebase/config.ts` as (the data details will be available at the firebase console when you create a `Web App`)

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

4. Use `npm start` to run the react app

## Packaging App

1. Use `npm run build` to package the react app
