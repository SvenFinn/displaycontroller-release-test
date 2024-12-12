FROM node:latest AS builder

WORKDIR /app/ranges/types
COPY --from=range-types . .

WORKDIR /app/screens/screenManager/types
COPY --from=screen-types . .

WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm i --loglevel=info;

COPY . .
RUN npm run build;

FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY --from=builder /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]