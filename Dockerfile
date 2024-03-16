#FROM node:18.16.0-alpine3.16 AS build
FROM node:lts-alpine AS build

WORKDIR /opt/www
COPY . /opt/www/

ARG MINE_NODE_ENV=production
ENV MINE_NODE_ENV $MINE_NODE_ENV

#RUN yarn config set registry https://mirrors.tencent.com/npm
RUN echo "MINE_NODE_ENV=$MINE_NODE_ENV"

#RUN yarn install --network-timeout 100000

RUN yarn config set registry http://mirrors.cloud.tencent.com/npm/

RUN npm config set registry http://mirrors.cloud.tencent.com/npm/


RUN yarn config list


RUN yarn install && \
    if [ "$MINE_NODE_ENV" = "development" ]; then yarn build --mode development; fi && \
    if [ "$MINE_NODE_ENV" = "production" ]; then yarn build --mode production; fi && \
    yarn cache clean

RUN yarn generate:version

FROM nginx:alpine

COPY --from=build /opt/www/dist /usr/share/nginx/html
