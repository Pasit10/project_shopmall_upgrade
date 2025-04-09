FROM nginx:alpine

# สร้าง non-root user สำหรับรัน nginx
RUN adduser -D -u 1000 nginxuser && \
    mkdir -p /var/cache/nginx /var/log/nginx /tmp/nginx && \
    chown -R nginxuser:nginxuser /var/cache/nginx /var/log/nginx /tmp/nginx

# คัดลอกไฟล์คอนฟิก Nginx ที่ปรับแต่งแล้ว
COPY nginx.conf /etc/nginx/nginx.conf
# หรือถ้าต้องการเก็บ server block ในไฟล์แยก:
# COPY site.conf /etc/nginx/conf.d/default.conf

# ตั้งค่าการเข้าถึงไฟล์คอนฟิก
RUN chown -R nginxuser:nginxuser /etc/nginx && \
    chmod -R 755 /etc/nginx && \
    chmod 755 /tmp/nginx

# เปลี่ยนเป็น nginxuser
USER nginxuser

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]