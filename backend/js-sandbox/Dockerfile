# Use a small, official Node.js image
FROM node:18-alpine

# Create a dedicated, non-root user for security
RUN adduser -D sandboxuser
USER sandboxuser

# Set the working directory
WORKDIR /app

# Copy our runner script into the container
COPY runner.js .

# The command to run when the container starts
# This will execute our script with Node.js
CMD [ "node", "runner.js" ]