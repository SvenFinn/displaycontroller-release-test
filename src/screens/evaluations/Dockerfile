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
RUN cp src/entrypoint.sh dist/entrypoint.sh

FROM base AS final

RUN apt-get update; apt-get install smbclient iputils-ping iproute2 -y

COPY --from=build /app/dist ./
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 80

ENV NODE_ENV=production
ENV SMB_TMP_DIR=/tmp/smbHtml
ENV CONV_TMP_DIR=/tmp/convHtml
ENV SRV_TMP_DIR=/tmp/html
ENV SMB_SERVER=192.168.100.200

CMD ["bash", "entrypoint.sh"]