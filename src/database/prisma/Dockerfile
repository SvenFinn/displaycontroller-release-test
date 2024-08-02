FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS build

COPY . .
RUN rm -rf node_modules
RUN npm ci
RUN npm run build
COPY src/schema.prisma src/entrypoint.sh dist/
COPY src/migrations dist/migrations
RUN echo "SELF_DB_URL=$SELF_DB_URL" > dist/.env

FROM base AS final

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

RUN npx prisma generate

CMD ["bash" , "entrypoint.sh"]