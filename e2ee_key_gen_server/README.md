# Smartsapp End to End Encryption (E2EE) Server

Server to handle the **End to End Encryption (E2EE)** Key Exchange.

## Tools used

1. **Flask:** For server handling

## How to Use

To use the project follow the steps given below:

1. Install the necessary modules with the command `pip install -r requirements.txt`
2. Use `flask run` to run the server
3. The server will start running on port `127:0.0.1:8000` (end points: `/generate-keys` and `/generate-shared-key`)

## Why an additional server?

-   To enable cross-platform **E2EE**, an uniform algorithm is required to ensure that key mismatch doesn't occour.
-   Dart lacks properly implemented `Diffie Hellman Algorithm` (its difficult to store the `hex value` for the ones that are available)
-   TypeScript/JavaScript stores number `IEEE 754 standard` rendering it difficult to store large number **with high precision** and storing Numbers in `BigNumber` format, slows down the algorithm significantly (_20mins_ for key generation on `i5 8700k`)
-   So this server provides the `api end points` for the `key pair` & `shared key` generation
