# Use an official image with Chrome pre-installed for Puppeteer
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Set ownership to the 'pptruser' user for the working directory
RUN chown -R pptruser:pptruser /usr/src/app

# Switch to the 'pptruser' user
USER pptruser

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=pptruser:pptruser . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
