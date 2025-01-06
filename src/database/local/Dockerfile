FROM node:alpine AS base

WORKDIR /app

ARG SELF_DB_URL

FROM base AS deps

COPY package.json package-lock.json schema.prisma ./
RUN npm ci --omit=dev --loglevel=info;

FROM base AS build

COPY package.json package-lock.json schema.prisma ./
RUN npm ci --loglevel=info;

COPY . .
RUN npm run build && \
    echo "SELF_DB_URL=$SELF_DB_URL\n" > dist/.env;
COPY migrations dist/migrations
COPY src/entrypoint.sh schema.prisma dist/

FROM base AS final

RUN apk add --no-cache --update netcat-openbsd

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

CMD ["sh", "entrypoint.sh"]