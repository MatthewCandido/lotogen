# Use the official Node.js 18 image as the base image (adjust if Node.js 22 is required)
FROM node:18

# Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
	wget \
	ca-certificates \
	libnss3 \
	libxss1 \
	libasound2 \
	libatk-bridge2.0-0 \
	libatk1.0-0 \
	libcups2 \
	# libdbus-1-3 \
	libgdk-pixbuf2.0-0 \
	libnspr4 \
	libxcomposite1 \
	libxrandr2 \
	x11-xserver-utils \
	libglib2.0-0 \
	xdg-utils \
	libappindicator3-1 \
	fonts-liberation \
	chromium && \
	apt-get clean && \
	apt-get autoremove && \
	rm -rf /var/lib/apt/lists/*

# Install DBus
#RUN apt-get update && apt-get install -y dbus

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Generate a unique machine ID for DBus
#RUN dbus-uuidgen > /etc/machine-id

# Create the run directory for DBus
#RUN mkdir -p /var/run/dbus

# Start the DBus daemon
#RUN dbus-daemon --system --fork

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Make sure your script is executable
RUN chmod +x render-build.sh

# Run your build script
RUN ./render-build.sh || (echo "Debug Info: render-build.sh failed" && exit 1)

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
