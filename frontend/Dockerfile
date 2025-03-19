# Build stage (Node.js)
FROM node:lts AS builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage (NGINX)
FROM nginx:alpine AS final
COPY ./nginx_frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
