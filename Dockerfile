# Use Node.js 20 official image as a base
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
