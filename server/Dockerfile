# Use Puppeteer's Docker image as the base
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Switch to root user to perform necessary operations
USER root

# Install necessary dependencies
RUN apt-get update \
	&& apt-get install -y \
	wget \
	curl \
	gnupg2 \
	ca-certificates \
	sudo

# Add Google’s updated GPG key
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | tee /etc/apt/trusted.gpg.d/google.asc > /dev/null

# Add the Google Chrome repository
RUN echo "deb [signed-by=/etc/apt/trusted.gpg.d/google.asc] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Google Chrome
RUN apt-get update \
	&& apt-get install -y google-chrome-stable

# Set ownership of the app folder
RUN chown -R pptruser:pptruser /app

# Ensure /var/run/dbus exists and has correct permissions
RUN mkdir -p /var/run/dbus && chmod 755 /var/run/dbus

# Switch back to the Puppeteer user
USER pptruser

# Copy package files and install dependencies
COPY --chown=pptruser package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY --chown=pptruser . .

# Expose the app's port (Adjust based on your app configuration)
EXPOSE 3000

# Start dbus and run the app
# CMD service dbus start && node server.js
CMD node server.js
