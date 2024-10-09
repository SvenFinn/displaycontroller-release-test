FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx ./favicon.ico /etc/nginx/html/favicon.ico

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]