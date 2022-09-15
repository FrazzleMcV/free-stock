FROM node:18-alpine
RUN npm install -g npm@8.10.x

WORKDIR /usr/src/app/
COPY ./package.json /usr/src/app/package.json
RUN npm install --omit=dev

COPY ./src /usr/src/app/src

CMD ["node", "src/index.js"]
