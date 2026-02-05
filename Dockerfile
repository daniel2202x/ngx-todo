FROM node:24.12.0 AS builder
ARG TAG_NAME
ARG TARGET_ENV=prod
WORKDIR /app
COPY . .
# set version server side
RUN sed -i "s/TAG_NAME/$TAG_NAME/g" nginx.$TARGET_ENV.conf
# set version client side
RUN echo "{\"build\":\"$TAG_NAME\"}" > src/version.json
# build the app
RUN npm install
RUN npm run build:$TARGET_ENV

FROM nginx:1.29.5
ARG TARGET_ENV=prod
COPY --from=builder /app/nginx.$TARGET_ENV.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/ngx-todo/browser /usr/share/nginx/html
CMD sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/nginx.conf && nginx
