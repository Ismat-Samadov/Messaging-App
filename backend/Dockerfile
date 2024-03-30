# Use the official Node.js 14 image as a base
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt from source
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the application runs on
EXPOSE 3000

# Command to start the application
CMD ["node", "server.js"]
