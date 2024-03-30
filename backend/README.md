# Backend for Messaging App

This is the backend of our Messaging App project. It provides the necessary API endpoints and logic for user authentication, messaging, and user profile management.

## Technologies Used

- Express.js: Fast, unopinionated, minimalist web framework for Node.js.
- MongoDB: NoSQL database for storing user data and messages.
- Mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
- bcrypt: Library for hashing passwords securely.
- jsonwebtoken: Library for generating and verifying JSON Web Tokens (JWT) for authentication.
- dotenv: Module to load environment variables from a .env file into process.env.

## Installation

1. Clone this repository.
2. Navigate to the backend directory: `cd backend`.
3. Install dependencies: `npm install`.
4. Set up environment variables: Create a .env file and add your MongoDB connection string and JWT secret.
5. Start the server: `npm start`.

## API Endpoints

- `/api/auth/register`: POST endpoint to register a new user.
- `/api/auth/login`: POST endpoint to authenticate a user and generate a JWT token.
- `/api/messages`: POST endpoint to send a message and GET endpoint to retrieve messages between users.
- `/api/profile/:userId`: PUT endpoint to update user profile information.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

