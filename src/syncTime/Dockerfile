FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG MEYTON_DB_USER
ARG MEYTON_DB_PASS

FROM base AS local-deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/database/smdb
COPY --from=smdb-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/logger
COPY --from=logger . .
RUN npm ci --loglevel=info && \
    npm run build;

FROM local-deps AS deps

WORKDIR /app/syncTime
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info --install-links;

FROM local-deps AS build

WORKDIR /app/syncTime

COPY package.json package-lock.json ./
RUN npm i --loglevel=info --install-links;

COPY . .
RUN npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL\n \
    MEYTON_DB_USER=$MEYTON_DB_USER\n \
    MEYTON_DB_PASS=$MEYTON_DB_PASS\n" > dist/.env;

FROM base AS final

COPY --from=build /app/syncTime/dist ./
COPY --from=deps /app/syncTime/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "index.js"]