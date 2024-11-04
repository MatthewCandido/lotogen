# Dockerfile for Browserless
FROM ghcr.io/browserless/base:latest

# You can add additional configuration or environment variables if needed
# For example, setting preboot and session limits
ENV PREBOOT_CHROME=true
ENV MAX_CONCURRENT_SESSIONS=10

# Expose the port for browserless
EXPOSE 3000

# Default command (browserless base image should handle this)
CMD ["node", "server.js"]
