import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/index.js";
import "dotenv/config";
import { Server } from "socket.io";

const app = express();

app.use(
  cors({
    // credentials: true,
    // origin: "https://messaging-app-ochre.vercel.app",
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "https://messaging-app-ochre.vercel.app",
      },
    });

    io.on("connection", (socket) => {
      console.log("connected to socket");

      socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log(room);
      });

      socket.on("new message", (newMessageRecieved) => {
        const chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id === newMessageRecieved.sender._id) return;

          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });

      socket.off("setup", (userData) => {
        console.log("user disconnected");
        socket.leave(userData._id);
      });
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed: ", err);
  });
