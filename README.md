# Messaging App - Backend

This repository contains the backend codebase for the Messaging App project.

## Setup

1. Create environment variables on Render.com:

    ```
    MONGO_URL = yourmongoconnectionstring
    JWT_SECRET = somesecretword
    CLIENT_URL = https://chaffy.netlify.app/
    PORT = 3001
    ```

## Frontend Integration

To integrate the frontend with the backend, follow these steps:

1. Update the frontend file for the API URL. You can press Ctrl+F and search for "onrender" and replace it with your API URL.

   Update the following file:
   ```
   client/build/assets/index-BLdVwMf3.js
   ```