# Use official Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --production

# Copy rest of the source code
COPY . .

# Expose port (same as your .env PORT)
EXPOSE 3001

# Start the app
CMD ["node", "src/index.js"]
