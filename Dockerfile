# Build the Angular app
FROM node:latest AS angular-builder
ARG TAG_NAME
ARG TARGET_ENV=prod
WORKDIR /app
COPY . .
RUN sed -i "s/TAG_NAME/$TAG_NAME/g" nginx.conf
RUN npm install --force
RUN echo "{\"build\":\"$TAG_NAME\"}" > src/version.json
RUN npm run build:${TARGET_ENV}

# Build Capacitor Android app
# FROM thyrlian/android-sdk AS android-builder
# WORKDIR /app
# COPY --from=angular-builder . .

# Actual nginx server
FROM nginx
COPY --from=angular-builder /app/nginx.conf /etc/nginx/nginx.conf
# COPY --from=angular-builder /app/cypress/ssl/localhost.crt /etc/nginx/ssl_certificate.crt
# COPY --from=angular-builder /app/cypress/ssl/localhost.key /etc/nginx/ssl_certificate_key.key
COPY --from=angular-builder /app/dist/ngx-todo/browser /usr/share/nginx/html
# COPY --from=angular-builder /app/app-release-signed.apk /usr/share/nginx/html/ngx-todo-install.apk
CMD sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/nginx.conf && nginx -g "daemon off;"
