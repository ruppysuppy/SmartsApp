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
2. Enable `Google Analylitics`

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
3. Go to the `Rules` tab and use the fillowing rules:
    ```c++
    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
            match /contacts/{uid} {
                allow read, create, update: if request.auth != null;
            }
            match /keys/{uid} {
                allow read, create: if request.auth != null && request.auth.uid == uid;
            }
            match /messages/{msg} {
                allow read, create: if request.auth != null;
            }
            match /users/{uid} {
                allow read: if request.auth != null;
                allow create, update: if request.auth != null && request.auth.uid == uid;
            }
        }
    }
    ```
4. Go to the `Indexes` tab and create the following index:
    ```javascript
    {
        collection: "messages",
        fields: {
            users: Ascending,
            timestamp: Descending,
        },
        queryScope: Collection
    }
    ```

### Storage Setup

1. Go to the project `Storage` section
2. Create storage provisions for the project (choose the server nearest to your location)
3. Go to the rules tab and use the fillowing rules:
    ```c++
    rules_version = '2';
    service firebase.storage {
        match /b/{bucket}/o {
            match /profilepic/{uid} {
            allow read: if request.auth != null;
            allow create, update: if request.auth != null
                && request.auth.uid == uid
                && request.resource.size < 1024 * 1024
                && request.resource.contentType.matches('image/.*');
            }
            match /media/{media} {
            allow read: if request.auth != null;
            allow create: if request.auth != null
                && request.resource.size < 1024 * 1024
                && request.resource.contentType.matches('image/.*');
            }
        }
    }
    ```

### Note

Running the E2EE Key Generator Server is necessary for all Platforms
