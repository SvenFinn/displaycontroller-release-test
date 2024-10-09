FROM node:latest AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --loglevel=info; 

FROM base AS build

COPY . .
RUN npm ci --loglevel=info; \
    npm run build;
COPY package.json dist/

FROM base AS final

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "index.js"]