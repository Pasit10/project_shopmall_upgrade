FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: copy SSL certificates if using HTTPS
# COPY ./ssl/fullchain.pem /etc/nginx/ssl/
# COPY ./ssl/privkey.pem /etc/nginx/ssl/

EXPOSE 80
EXPOSE 443
# Uncomment when using HTTPS