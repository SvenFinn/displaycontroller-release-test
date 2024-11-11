FROM node:latest AS base

WORKDIR /app

FROM base AS local-deps

WORKDIR /app/logger
COPY --from=logger . .
RUN npm ci --loglevel=info && \
    npm run build

FROM local-deps AS deps

WORKDIR /app/screens/images
COPY package.json package-lock.json ./
RUN npm i --omit=dev --loglevel=info --install-links

FROM local-deps AS build

WORKDIR /app/screens/images
COPY . .
RUN rm -rf node_modules; \
    npm i --loglevel=info --install-links; \
    npm run build
COPY src/img dist/src/img

FROM base AS final

RUN apt-get update; apt-get install ghostscript graphicsmagick -y; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*;

COPY --from=build /app/screens/images/dist ./
COPY --from=deps /app/screens/images/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production

CMD ["node", "./src/index.js"]