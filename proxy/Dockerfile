FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx ./favicon.ico /etc/nginx/html/favicon.ico

EXPOSE 80

HEALTHCHECK --interval=5s --timeout=1s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]