FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application
COPY . .

# Command to run your application
CMD ["node", "server.js"]
