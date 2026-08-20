FROM node:24

WORKDIR /backend

COPY package.json .

RUN yarn config set network-timeout 3000000

RUN yarn install

COPY . . 

EXPOSE 8000

CMD ["node", "server.js"]