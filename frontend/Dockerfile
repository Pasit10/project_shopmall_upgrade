# Build stage (Node.js)
FROM node:lts AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm install --ignore-scripts
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# Final stage (NGINX)
FROM nginx:alpine AS final

RUN adduser -D -u 1000 nginxuser && \
    mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R nginxuser:nginxuser /var/cache/nginx /var/run /var/log/nginx /etc/nginx

COPY ./nginx_frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html

RUN chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

RUN sed -i 's/user  nginx;/user  nginxuser;/' /etc/nginx/nginx.conf && \
    chmod +x /etc/nginx/nginx.conf

USER nginxuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
