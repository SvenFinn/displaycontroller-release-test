FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG MEYTON_DB_USER
ARG MEYTON_DB_PASS

FROM base AS deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/database/smdb
COPY --from=smdb-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/syncTime
COPY . ./

RUN npm i --omit=dev --loglevel=info --install-links;

FROM deps AS build

RUN npm i --loglevel=info; \
    npm run build; \
    echo "SELF_DB_URL=$SELF_DB_URL\n \
    MEYTON_DB_USER=$MEYTON_DB_USER\n \
    MEYTON_DB_PASS=$MEYTON_DB_PASS\n" > dist/.env;
COPY package.json dist/

FROM base AS final

COPY --from=build /app/syncTime/dist ./
COPY --from=deps /app/syncTime/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "index.js"]