FROM node:latest AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --loglevel=info

FROM base AS build

COPY . .
RUN rm -rf node_modules; \
    npm ci --loglevel=info; \
    npm run build
COPY src/img dist/src/img

FROM base AS final

RUN apt-get update; apt-get install ghostscript graphicsmagick -y; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*;

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "./src/index.js"]