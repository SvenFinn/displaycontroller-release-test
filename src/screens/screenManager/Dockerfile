FROM node:latest AS base

ARG SELF_DB_URL

FROM base AS deps

WORKDIR /app/database/local
COPY --from=local-db . .
RUN npm ci --loglevel=info;\
    npm run build;

WORKDIR /app/screens
COPY . .

WORKDIR /app/screens/screenManager
RUN npm i --omit=dev --loglevel=info --install-links; 

FROM deps AS build
RUN npm i --loglevel=info --install-links; \
    npm run build; \
    echo "SELF_DB_URL=$SELF_DB_URL" > dist/.env;

COPY ./screenManager/package.json ./dist/

FROM base AS final

WORKDIR /app

COPY --from=build /app/screens/screenManager/dist ./
COPY --from=deps /app/screens/screenManager/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "./screenManager/src/index.js"]