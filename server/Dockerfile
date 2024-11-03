# Use the official Node.js 18 image as the base image
FROM node:18-slim

# Install necessary dependencies for Puppeteer and Chrome
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  libnss3 \
  libxss1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libxcomposite1 \
  libxrandr2 \
  xdg-utils \
  libappindicator3-1 \
  fonts-liberation \
  --no-install-recommends && \
  # Download and install Chrome
  wget -qO- https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /usr/share/keyrings/chrome-archive-keyring.gpg && \
  echo "deb [signed-by=/usr/share/keyrings/chrome-archive-keyring.gpg] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && apt-get install -y google-chrome-stable && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
