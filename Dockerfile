#FROM node:18.16.0-alpine3.16 AS build
FROM node:lts-alpine AS build

WORKDIR /opt/www
COPY . /opt/www/

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

#RUN yarn config set registry https://mirrors.tencent.com/npm
RUN echo "NODE_ENV=$NODE_ENV"

#RUN yarn install --network-timeout 100000

RUN yarn config set registry http://mirrors.cloud.tencent.com/npm/

RUN npm config set registry http://mirrors.cloud.tencent.com/npm/


RUN yarn config list


RUN yarn install && \
    if [ "$NODE_ENV" = "development" ]; then yarn build --mode development; fi && \
    if [ "$NODE_ENV" = "production" ]; then yarn build --mode production; fi && \
    yarn cache clean

RUN yarn generate:version

FROM nginx:alpine

COPY --from=build /opt/www/dist /usr/share/nginx/html
