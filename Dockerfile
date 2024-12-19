FROM node:latest AS builder
ARG TAG_NAME
ARG TARGET_ENV=prod
WORKDIR /app
COPY . .
RUN sed -i "s/TAG_NAME/$TAG_NAME/g" nginx.conf
RUN npm install --force
RUN echo "{\"build\":\"$TAG_NAME\"}" > src/version.json
RUN npm run build:$TARGET_ENV

FROM nginx
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/ngx-todo/browser /usr/share/nginx/html
CMD sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/nginx.conf && nginx -g "daemon off;"
