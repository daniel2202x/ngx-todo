FROM node:latest AS builder
ARG TAG_NAME
ARG TARGET_ENV=prod
WORKDIR /app
COPY . .
# set version server side
RUN sed -i "s/TAG_NAME/$TAG_NAME/g" nginx.conf
# set version client side
RUN echo "{\"build\":\"$TAG_NAME\"}" > src/version.json
# build the app
RUN npm install --force
RUN npm run build:$TARGET_ENV

FROM nginx
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/ngx-todo/browser /usr/share/nginx/html
CMD sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/nginx.conf && nginx -g "daemon off;"
