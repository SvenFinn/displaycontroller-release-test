FROM node:latest AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
COPY --from=local-db *.tgz ./deps/local/
COPY --from=smdb-db *.tgz ./deps/smdb/
RUN npm remove dc-db-local dc-db-smdb --loglevel=info; \
    npm ci --omit=dev --loglevel=info; \
    npm i ./deps/**/*.tgz --loglevel=info;

FROM base AS build

COPY . .
COPY --from=local-db *.tgz ./deps/local/
COPY --from=smdb-db *.tgz ./deps/smdb/
RUN rm -rf node_modules; \
    npm remove dc-db-local dc-db-smdb --loglevel=info; \
    npm ci --loglevel=info; \
    npm i ./deps/**/*.tgz --loglevel=info; \
    npm run build; 
COPY package.json dist/

FROM base AS final

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "index.js"]