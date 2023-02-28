FROM node:lts-alpine

WORKDIR /opt/www
COPY . /opt/www/

ENV NODE_ENV=development


RUN yarn install \
    && yarn build  --mode development \
    && yarn cache clean


FROM nginx:alpine

COPY --from=0 /opt/www/dist /usr/share/nginx/html
