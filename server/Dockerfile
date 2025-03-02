FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Start dbus and run the app
CMD service dbus start && node server.js
