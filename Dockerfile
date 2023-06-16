
FROM node:16.14-alpine3.14

WORKDIR /fixture_assignment

COPY ./package*.json ./yarn.lock ./config /fixture_assignment/

RUN yarn add glob rimraf

RUN yarn install --only=development

COPY ./ /fixture_assignment/

RUN yarn run build

CMD ["yarn", "start:prod", "/fixture_assignment/"]
