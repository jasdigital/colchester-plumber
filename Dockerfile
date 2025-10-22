# Use Node.js LTS with explicit platform to avoid ARM64 issues
FROM node:18-alpine
 
# Set the working directory inside the container
WORKDIR /src

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies with forced rebuild of native modules
RUN npm ci && npm rebuild
 
# Copy the rest of your application files
COPY . .

# Build the application for production
RUN npm run build
 
# Expose the port your app runs on
EXPOSE 5173
 
# Use vite preview to serve the built files
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173" , "--no-open"]
