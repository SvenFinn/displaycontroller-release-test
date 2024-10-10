FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG TARGET_DEFAULT_COLOR=00A078
ARG MEYTON_DB_PASS
ARG MEYTON_DB_USER

FROM base AS deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/database/smdb
COPY --from=smdb . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/database/tableWatcher
COPY --from=table-watcher . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/ranges/types
COPY --from=range-types . .

WORKDIR /app/ranges/cache
COPY . ./
RUN npm i --omit=dev --loglevel=info --install-links;

FROM deps AS build

COPY ./package.json dist/
RUN npm i --loglevel=info --install-links; \
    npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL\n \
    TARGET_DEFAULT_COLOR=$TARGET_DEFAULT_COLOR\n \
    MEYTON_DB_PASS=$MEYTON_DB_PASS\n \
    MEYTON_DB_USER=$MEYTON_DB_USER" > dist/.env;

FROM base AS final

WORKDIR /app

COPY --from=build /app/ranges/cache/dist ./
COPY --from=deps /app/ranges/cache/node_modules ./node_modules

ENV NODE_ENV=production


CMD ["node", "/app/cache/src/index.js"]