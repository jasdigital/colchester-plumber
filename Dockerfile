# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite defaults to output in /dist
RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine
# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]