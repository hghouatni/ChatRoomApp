# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json for dependency resolution
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/chat-app-front/* /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# When the container starts, nginx will start automatically
CMD ["nginx", "-g", "daemon off;"]
