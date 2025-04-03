FROM nginx:alpine

# Create a non-root user to run nginx
RUN adduser -D -u 1000 nginxuser && \
    mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R nginxuser:nginxuser /var/cache/nginx /var/run /var/log/nginx

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: copy SSL certificates if using HTTPS
# COPY ./ssl/fullchain.pem /etc/nginx/ssl/
# COPY ./ssl/privkey.pem /etc/nginx/ssl/

# Set proper permissions on config and certificates
RUN chown -R nginxuser:nginxuser /etc/nginx/conf.d && \
    chmod -R 755 /etc/nginx/conf.d && \
    mkdir -p /usr/share/nginx/html && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html
    # Uncomment when using HTTPS
    # && mkdir -p /etc/nginx/ssl && \
    # chown -R nginxuser:nginxuser /etc/nginx/ssl && \
    # chmod -R 600 /etc/nginx/ssl

# Update the nginx.conf to run as the non-root user
RUN sed -i 's/user  nginx;/user  nginxuser;/' /etc/nginx/nginx.conf

# For binding to privileged ports as non-root
# Method 1: Use higher non-privileged ports in nginx.conf instead of 80/443
# Method 2: Add capability during container run:
#           docker run --cap-add=NET_BIND_SERVICE ...

USER nginxuser

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]