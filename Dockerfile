# --- Stage 1: Build static assets ---
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency configs and utilize docker cache layers
COPY package*.json ./
RUN npm ci

# Copy all source files and run production compilation
COPY . .
RUN npm run build

# --- Stage 2: Serve with light Nginx ---
FROM nginx:alpine AS runner

# Remove default configuration and copy our optimized config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static build output from builder stage
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
