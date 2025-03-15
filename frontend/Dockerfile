# Build stage (Node.js)
FROM node:lts AS builder
WORKDIR /app
COPY . .

# Copy package.json and other necessary files before installing dependencies
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .

RUN npm install
RUN npm run build

# Final stage (NGINX)
FROM nginx:alpine AS final

# Copy NGINX configuration to container
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from build stage to the directory that NGINX will serve
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
