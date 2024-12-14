FROM node:latest AS base

WORKDIR /app

ARG MIN_MEYTON_VERSION
ARG MAX_MEYTON_VERSION
ARG MEYTON_SSH_PASS
ARG MEYTON_SSH_USER
ARG SELF_DB_URL

FROM base AS local-deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info &&\
    npm run build;

WORKDIR /app/logger
COPY --from=logger . .
RUN npm ci --loglevel=info &&\
    npm run build;

FROM local-deps AS deps

WORKDIR /app/checkServer
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info --install-links;

FROM local-deps AS build

WORKDIR /app/screens/screenManager/types
COPY --from=screen-manager . .

WORKDIR /app/checkServer

COPY package.json package-lock.json ./
RUN npm i --loglevel=info --install-links;

COPY . .
RUN npm run build && \
    echo "MIN_MEYTON_VERSION=$MIN_MEYTON_VERSION\n \
    MAX_MEYTON_VERSION=$MAX_MEYTON_VERSION\n \
    MEYTON_SSH_USER=$MEYTON_SSH_USER\n \
    MEYTON_SSH_PASS=$MEYTON_SSH_PASS\n \
    SELF_DB_URL=$SELF_DB_URL" > dist/.env;

FROM base AS final

RUN apt-get update; apt-get install sshpass netcat-openbsd -y; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*;

WORKDIR /app

COPY --from=build /app/checkServer/dist ./
COPY --from=deps /app/checkServer/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "/app/checkServer/src/index.js"]