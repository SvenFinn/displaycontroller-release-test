FROM node:latest AS builder

WORKDIR /app/frontend
COPY . .
RUN npm i --loglevel=info &&  \
    npm run build;

FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY --from=builder /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]