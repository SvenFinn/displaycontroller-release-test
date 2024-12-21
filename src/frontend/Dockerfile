FROM node:latest AS base

WORKDIR /app

ARG SELF_DB_URL
ARG MEYTON_DB_USER
ARG MEYTON_DB_PASS

FROM base AS deps

WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info

FROM base AS build

WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm i --loglevel=info

WORKDIR /app/ranges/types
COPY --from=range-types . .

WORKDIR /app/screens/screenManager/types
COPY --from=screen-types . .

WORKDIR /app/frontend
COPY . .
RUN npm run build;

FROM base AS final

WORKDIR /app

COPY --from=build /app/frontend/public /app/public
COPY --from=build /app/frontend/.next/standalone /app
COPY --from=build /app/frontend/.next/static /app/.next/static

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

CMD ["node", "server.js"]