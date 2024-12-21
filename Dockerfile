FROM --platform=linux/amd64 node:18-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY prisma ./prisma/
COPY src/prisma ./src/prisma/

RUN npx prisma generate

COPY . .

RUN apt-get update && apt install -y openssl

EXPOSE 3344
EXPOSE 5555

CMD [ "yarn", "dev" ]
