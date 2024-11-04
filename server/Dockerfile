# Use the official Node.js 18 image as the base image
FROM node:18-slim

# Install necessary dependencies for Puppeteer and Chrome
RUN apt-get update && apt-get install -y --no-install-recommends \
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
	fonts-liberation && \
	# Download and install Google Chrome
	wget -q -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
	dpkg -i /tmp/google-chrome.deb || apt-get -y -f install && \
	rm -rf /tmp/google-chrome.deb && \
	apt-get clean && \
	apt-get autoremove && \
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
