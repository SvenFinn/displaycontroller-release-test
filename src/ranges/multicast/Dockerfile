FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL

FROM base AS local-deps

WORKDIR /app/logger
COPY --from=logger . .
RUN npm ci --loglevel=info && \
    npm run build;

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info && \
    npm run build;

FROM local-deps AS deps

WORKDIR /app/ranges/multicast
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info --install-links;

FROM local-deps AS build

WORKDIR /app/ranges/types
COPY --from=range-types . .

WORKDIR /app/ranges/multicast
COPY . .
RUN npm i --loglevel=info --install-links && \
    npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL" > dist/.env;

FROM base AS final

WORKDIR /app

COPY --from=build /app/ranges/multicast/dist ./
COPY --from=deps /app/ranges/multicast/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "/app/multicast/src/index.js"]