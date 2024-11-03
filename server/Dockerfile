# Use a pre-built image with Chrome and Puppeteer
FROM browserless/chrome:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Temporarily switch to root user
USER root

# Install dependencies
RUN npm install

# Switch back to the default user
USER chrome

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
