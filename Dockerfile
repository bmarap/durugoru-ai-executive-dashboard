# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies (using clean install)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the production application
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


# Production stage
FROM nginx:alpine

# Copy the built assets to Nginx's default directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx config if needed (optional, but good for SPAs)
# In our case we use hash router or simple paths, so default Nginx is usually fine.
# We'll stick to default for a simple SPA. If React Router were used with History API, 
# we'd need a custom nginx.conf to redirect 404s to index.html.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
