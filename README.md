# Messaging App

## Description:

This messaging app project is built as part of The Odin Project curriculum. It utilizes React for the frontend, Express for the backend, and MongoDB as the database. The app provides users with the ability to add friends, create group chats, and upload pictures to enhance communication.

Deployed on [Netlify](https://messaging-app-odin.netlify.app/)

![website snapshot](https://raw.githubusercontent.com/Extraterra1/Messaging-App/main/website-snapshot.png)

## Table of Contents:

- [Installation](https://github.com/Extraterra1/Messaging-App#installation)
- [Usage](https://github.com/Extraterra1/Messaging-App#usage)
- [Features](https://github.com/Extraterra1/Messaging-App#features)

## Installation:

To run this messaging app locally, follow these steps:

1.  Clone this repository to your local machine.
2.  Navigate to the `frontend` directory and run `npm install` to install frontend dependencies.
3.  Navigate to the `backend` directory and run `npm install` to install backend dependencies.

4.  Create a `.env` file in the `backend` directory and add your MongoDB connection string as `DB_URL`.
5.  In the `backend` directory, run `npm start` to start the Express server.
6.  In the `frontend` directory, run `npm run dev` to start the React development server.

## Usage:

Once the app is running locally, you can access it through your web browser. Here are some key features:

- **User Authentication:** Users can sign up, log in, and log out securely.
- **Add Friends:** Users can search for and add friends to their contacts list.
- **Create Group Chats:** Users can create group chats and add multiple friends to the conversation.
- **Upload Pictures:** Users can upload and share pictures within individual and group chats.

## Features:

- **React Frontend:** Provides a responsive and interactive user interface.
- **Express Backend:** Handles server-side logic and API endpoints for data manipulation.
- **MongoDB Database:** Stores user information, friend lists, group chat data, and uploaded pictures.
- **User Authentication:** Ensures secure access to the app's features.
