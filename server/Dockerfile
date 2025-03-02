FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Set ownership to ensure the user inside the container has permissions
RUN chown -R pptruser:pptruser /app

# Switch to the Puppeteer user
USER pptruser

# Copy package files and install dependencies
COPY --chown=pptruser package*.json ./
RUN npm install

# Copy the rest of the application
COPY --chown=pptruser . .

# Start dbus and run the app
CMD service dbus start && node server.js
