FROM nginx

COPY dist/ngx-todo/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

# development: use the SSL files for localhost (for Cypress and local testing)
COPY cypress/ssl/localhost.cr[t] /etc/nginx/ssl_certificate.crt
COPY cypress/ssl/localhost.ke[y] /etc/nginx/ssl_certificate_key.key

# production: use the SSL files the CI has created
COPY ssl_certificate.cr[t] /etc/nginx/ssl_certificate.crt
COPY ssl_certificate_key.ke[y] /etc/nginx/ssl_certificate_key.key

# native apps are only available in production
COPY app-release-signed.ap[k] /usr/share/nginx/html/ngx-todo-install.apk

EXPOSE 80
EXPOSE 443
