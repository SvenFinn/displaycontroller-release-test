FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL

FROM base AS deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/screens/evaluations
COPY . ./

RUN npm i --omit=dev --loglevel=info --install-links;

FROM deps AS build

COPY package.json dist/
RUN npm i --loglevel=info --install-links; \
    npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL" > dist/.env;

FROM base AS final

RUN apt-get update; apt-get install smbclient -y;\
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*;

COPY --from=build /app/screens/evaluations/dist ./
COPY --from=deps /app/screens/evaluations/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "src/index.js"]