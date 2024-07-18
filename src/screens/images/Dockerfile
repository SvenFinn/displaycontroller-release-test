FROM node:latest AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS build

COPY . .
RUN rm -rf node_modules
RUN npm ci
RUN npm run build

FROM base AS final

RUN apt-get update; apt-get install ghostscript graphicsmagick -y

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production
ENV BASE_PATH=/app/files
ENV BASE_API_URL=/api/images

CMD ["node", "index.js"]