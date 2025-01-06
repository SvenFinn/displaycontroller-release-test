FROM node:alpine AS base

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

WORKDIR /app/screens/evaluations
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info --install-links;

FROM local-deps AS build

WORKDIR /app/screens/evaluations

COPY package.json package-lock.json ./
RUN npm i --loglevel=info --install-links;

COPY . .
RUN npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL" > dist/.env;

FROM base AS final

RUN apk add --no-cache samba-client

COPY --from=build /app/screens/evaluations/dist ./
COPY --from=deps /app/screens/evaluations/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "src/index.js"]