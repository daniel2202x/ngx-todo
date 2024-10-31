FROM nginx

COPY dist/ngx-todo/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY ssl_certificate.crt /etc/nginx/ssl_certificate.crt
COPY ssl_certificate_key.key /etc/nginx/ssl_certificate_key.key

COPY app-release-signed.ap[k] /usr/share/nginx/html/ngx-todo-install.apk

EXPOSE 443
