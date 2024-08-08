FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --loglevel=info;

FROM base AS build

COPY . .
COPY src/entrypoint.sh src/schema.prisma dist/
RUN rm -rf node_modules; \
    npm ci --loglevel=info; \
    npx prisma generate --schema=dist/schema.prisma; \
    npm run build; \
    echo "SELF_DB_URL=$SELF_DB_URL\n" > dist/.env;
COPY src/migrations dist/migrations

FROM base AS final

RUN apt-get update && apt-get install netcat-openbsd -y

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

RUN npx prisma generate --schema=schema.prisma

CMD ["bash" , "entrypoint.sh"]