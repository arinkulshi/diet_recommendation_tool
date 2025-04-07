FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# For production, we'll build during container startup
# This allows us to use the same Dockerfile for dev and prod

EXPOSE 5173

CMD ["npm", "run", "dev"]