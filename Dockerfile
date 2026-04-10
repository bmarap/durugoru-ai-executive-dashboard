# Build stage - Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies (using clean install)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the production application
RUN npm run build


# Production stage - Nginx + Node API in one container
FROM node:20-alpine

# Install Nginx
RUN apk add --no-cache nginx

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Remove the default Nginx config that listens on port 80 to avoid conflicts
RUN rm -f /etc/nginx/http.d/default.conf

# Copy the built frontend assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the API source
COPY api/package*.json /api/
RUN cd /api && npm install --omit=dev
COPY api/server.js /api/server.js

# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
