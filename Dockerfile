FROM nginx

COPY dist/ngx-todo/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY ngx-todo_com_chain.crt /etc/nginx/ngx-todo_com_chain.crt
COPY ngx_todo_com.key /etc/nginx/ngx_todo_com.key

COPY app-release-signed.ap[k] /usr/share/nginx/html/ngx-todo-install.apk

EXPOSE 443
