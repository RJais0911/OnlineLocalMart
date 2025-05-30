# Use Node.js as base image
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy package.json from project root
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . ./

# Expose the port your app runs on
EXPOSE 3000

# Verify the file exists and show directory structure for debugging
RUN ls -la && ls -la src/

# Command to run the application
CMD ["node", "src/server.js"]