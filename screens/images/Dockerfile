FROM node:alpine AS base

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

COPY package.json package-lock.json ./
RUN npm i --loglevel=info --install-links

COPY . .
RUN npm run build
COPY src/img dist/src/img

FROM base AS final

RUN apk add --no-cache --update ghostscript graphicsmagick

COPY --from=build /app/screens/images/dist ./
COPY --from=deps /app/screens/images/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production
ENV LOG_LEVEL=info

CMD ["node", "./src/index.js"]