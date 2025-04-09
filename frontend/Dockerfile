# Build stage (Node.js)
FROM node:lts AS builder
WORKDIR /app

# Copy configuration files first
COPY package.json package-lock.json tsconfig.json tsconfig.node.json tsconfig.app.json ./
COPY vite.config.ts ./
COPY index.html ./

RUN npm install --ignore-scripts

# Copy source and public directories
COPY src/ ./src/
COPY public/ ./public/
COPY .env .env

# Build the application
RUN npm run build



# Final stage (NGINX)
FROM nginx:alpine AS final


# Create non-root user and temp pid folder
RUN mkdir -p /tmp/nginx && \
    adduser -D -u 1000 nginxuser && \
    chown -R nginxuser:nginxuser /tmp/nginx

# Copy NGINX config
COPY ./nginx_frontend.conf /etc/nginx/conf.d/default.conf

# Remove default 'pid' directive from nginx.conf
RUN sed -i 's|^pid .*|# pid removed by Dockerfile;|' /etc/nginx/nginx.conf

# Copy built frontend from builder
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Set permissions
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chmod 644 /etc/nginx/nginx.conf && \
    chmod -R 644 /etc/nginx/conf.d/* && \
    chmod 755 /etc/nginx/conf.d && \
    chown -R nginxuser:nginxuser /var/cache/nginx /var/log/nginx /etc/nginx

# Switch to non-root user
USER nginxuser
EXPOSE 80

# Use custom pid path (avoid /var/run permission issue)
CMD ["nginx", "-g", "daemon off; pid /tmp/nginx/nginx.pid;"]