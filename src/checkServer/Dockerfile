FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG MIN_MEYTON_VERSION
ARG MAX_MEYTON_VERSION

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --loglevel=info; 

FROM base AS build

COPY . .
COPY --from=database schema.prisma dist/
RUN rm -rf node_modules; \
    npm ci --loglevel=info; \
    npx prisma generate --schema=dist/schema.prisma; \
    npm run build; \
    echo "MIN_MEYTON_VERSION=$MIN_MEYTON_VERSION\n \
    MAX_MEYTON_VERSION=$MAX_MEYTON_VERSION\n \
    SELF_DB_URL=$SELF_DB_URL\n" > dist/.env;
COPY package.json dist/

FROM base AS final

RUN apt-get update; apt-get install sshpass netcat-openbsd -y

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

RUN npx prisma generate --schema=schema.prisma

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "index.js"]