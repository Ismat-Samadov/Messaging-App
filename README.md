# messaging-app
## About
This is a personal project created using MERN stack, tailwindCSS, shadcn/ui and socket.io. The purpose of this project is to understand and implement the workings of realtime server and websockets.

As of right now the project is a bit lacking in frontend (because I was working on this alone and it had been too long so I needed it to be finished quickly), but all the critical components are working and the backend is complete.

**Check it out** [Live](https://messaging-app-ochre.vercel.app/)

**NOTE:** The server is deployed on a free service so it might take some time to boot up so the first request might take upto 30-40 seconds but subsequent requests should be fast.

## Development Setup
Pre-requisite: 
- Install and setup mongodb community server
- Create an account on cloudinary

Next steps:
1. Clone the repository:
   ```
   git clone https://github.com/faizan-20/messaging-app
   ```

2. Go to server and copy .env.example to .env and fill all the variables if not already filled.

3. Inside server, run
   ```
   npm run dev
   ```

4. Go to client and chage the server link from PROD to DEV insinde main.tsx

5. Inside client, run
   ```
   npm run dev
   ```
