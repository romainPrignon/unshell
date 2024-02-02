###
# base stage
###
FROM node:18.16.0-bullseye-slim as base

WORKDIR /opt

COPY package.json package-lock.json ./


###
# install stage
###
FROM base as install

RUN npm ci --legacy-peer-deps


###
# build stage
###
FROM install as build

COPY . .
RUN npm run compile


###
# prune stage
###
FROM install as prune

RUN npm prune --production


###
# dev stage
###
FROM base as dev

ENV APP_ENV="development"
ENV NODE_ENV="development"

RUN apt update && apt install -y git

COPY --from=build --chown=node /opt/ /opt/

USER node
CMD ["npm", "run", "test"]
