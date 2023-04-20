FROM node:18-alpine as base

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY package*.json ./
EXPOSE 3030

FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . .
CMD ["node", "bin/www"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD ["npm", "run", "development"]