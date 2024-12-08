# Use Node.js 18 with Alpine for a lightweight image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only the package files first
COPY package.json package-lock.json ./

RUN npm install 

# Copy the rest of the application files
COPY . .

# Expose the development server port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
