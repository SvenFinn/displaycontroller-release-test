FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL

FROM base AS deps

COPY package.json package-lock.json ./
COPY --from=local-db *.tgz ./deps/
RUN npm remove dc-db-local --loglevel=info; \
    npm ci --omit=dev --loglevel=info; \
    npm i ./deps/*tgz --loglevel=info;



FROM base AS build

COPY . .
COPY --from=local-db *.tgz ./deps/
COPY package.json dist/
RUN npm remove dc-db-local --loglevel=info; \
    npm ci --loglevel=info; \
    npm i ./deps/*.tgz --loglevel=info; \
    npm run build; \
    echo "SELF_DB_URL=$SELF_DB_URL" > dist/.env; 

FROM base AS final

RUN apt-get update; apt-get install smbclient -y

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 80

CMD ["node", "index.js"]