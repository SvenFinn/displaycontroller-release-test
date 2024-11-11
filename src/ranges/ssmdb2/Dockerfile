FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG MEYTON_DB_PASS
ARG MEYTON_DB_USER

FROM base AS local-deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/database/ssmdb2
COPY --from=ssmdb2 . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/database/tableWatcher
COPY --from=table-watcher . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/logger
COPY --from=logger . .
RUN npm ci --loglevel=info && \
    npm run build;

FROM local-deps AS deps

WORKDIR /app/ranges/ssmdb2
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info --install-links;

FROM local-deps AS build

WORKDIR /app/ranges/types
COPY --from=range-types . .

WORKDIR /app/ranges/ssmdb2
COPY . .
RUN npm i --loglevel=info --install-links; \
    npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL\n \
    MEYTON_DB_PASS=$MEYTON_DB_PASS\n \
    MEYTON_DB_USER=$MEYTON_DB_USER" > dist/.env;
FROM base AS final

WORKDIR /app

COPY --from=build /app/ranges/ssmdb2/dist ./
COPY --from=deps /app/ranges/ssmdb2/node_modules ./node_modules

ENV NODE_ENV=production
ENV TZ=Europe/Berlin

CMD ["node", "/app/ssmdb2/src/index.js"]