# Use Node
FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy app
COPY . .

# Expose Vite port
EXPOSE 7003

# Run Vite
CMD ["npm", "run", "dev", "--", "--host", "--port", "7003"]