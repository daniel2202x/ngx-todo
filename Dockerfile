# Build the Angular app
FROM node:latest AS builder
ARG TARGET_ENV=prod
WORKDIR /app
COPY . .
RUN npm install --force
RUN sed -i "s/VERSION_TAG/$(git describe --tags)/g" nginx.conf
RUN echo "{\"build\":\"$(git describe --tags)\"}" > src/version.json
RUN npm run build:${TARGET_ENV}

# Actual nginx server
FROM nginx
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/cypress/ssl/localhost.crt /etc/nginx/ssl_certificate.crt
COPY --from=builder /app/cypress/ssl/localhost.key /etc/nginx/ssl_certificate_key.key
COPY --from=builder /app/dist/ngx-todo/browser /usr/share/nginx/html
# COPY --from=builder /app/app-release-signed.apk /usr/share/nginx/html/ngx-todo-install.apk
CMD sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/nginx.conf && nginx -g "daemon off;"
