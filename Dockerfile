# physio-backend/Dockerfile

# Use official Node.js 18 LTS image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set environment variables (will be overridden by Cloud Run)
ENV NODE_ENV=production
ENV PORT=8080

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
