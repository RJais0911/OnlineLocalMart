# Use Node.js (Debian-based version for stability)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Configure npm registry and retry settings
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (installs express and others) with retry
RUN npm install --verbose || npm install --verbose || npm install --verbose

# Copy the rest of the application
COPY . .

# Expose your app's port (3000)
EXPOSE 3000

# Set environment variable if needed
ENV NODE_PATH=/app/node_modules

# Start the application
CMD ["node", "src/server.js"]

