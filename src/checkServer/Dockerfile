FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG MIN_MEYTON_VERSION
ARG MAX_MEYTON_VERSION
ARG MEYTON_SSH_PASS
ARG MEYTON_SSH_USER

FROM base AS deps

COPY package.json package-lock.json ./
COPY --from=local-db *.tgz ./deps/
RUN npm remove dc-db-local --loglevel=info; \
    npm ci --omit=dev --loglevel=info; \
    npm i ./deps/*tgz --loglevel=info;

FROM base AS build

COPY . .
COPY --from=local-db *.tgz ./deps/
RUN npm remove dc-db-local --loglevel=info; \
    npm ci --loglevel=info; \
    npm i ./deps/*.tgz --loglevel=info; \
    npm run build; \
    echo "MIN_MEYTON_VERSION=$MIN_MEYTON_VERSION\n \
    MAX_MEYTON_VERSION=$MAX_MEYTON_VERSION\n \
    MEYTON_SSH_USER=$MEYTON_SSH_USER\n \
    MEYTON_SSH_PASS=$MEYTON_SSH_PASS\n \
    SELF_DB_URL=$SELF_DB_URL\n" > dist/.env;
COPY package.json dist/

FROM base AS final

RUN apt-get update; apt-get install sshpass netcat-openbsd -y

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "index.js"]