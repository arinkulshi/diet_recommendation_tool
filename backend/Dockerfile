FROM node:24-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the API port
EXPOSE 3000

# Default command
CMD ["npm", "start"]
