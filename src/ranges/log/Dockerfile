FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG MEYTON_SSH_USER
ARG MEYTON_SSH_PASS

FROM base AS local-deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info && \
    npm run build;

WORKDIR /app/ranges/ttl
COPY --from=range-ttl . .
RUN npm ci --loglevel=ifno && \
    npm run build;

FROM local-deps AS deps

WORKDIR /app/ranges/log
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info --install-links;

FROM local-deps AS build

WORKDIR /app/ranges/types
COPY --from=range-types . .

WORKDIR /app/ranges/log
COPY . .
RUN npm i --loglevel=info --install-links && \
    npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL\n \
    MEYTON_SSH_USER=$MEYTON_SSH_USER\n \
    MEYTON_SSH_PASS=$MEYTON_SSH_PASS" > dist/.env;
COPY package.json dist/
COPY src/logReader/range-logs.sh dist/log/src/logReader/

FROM base AS final

WORKDIR /app

RUN apt-get update; apt-get install sshpass -y; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*;

COPY --from=build /app/ranges/log/dist ./
COPY --from=deps /app/ranges/log/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "/app/log/src/index.js"]