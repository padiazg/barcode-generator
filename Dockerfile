FROM node:lts-alpine

ENV EXPRESS_PORT=3000
EXPOSE ${EXPRESS_PORT}

WORKDIR /app

COPY index.js .
COPY package.json .
COPY utils.js .

RUN npm install

CMD ["node", "index.js"]
