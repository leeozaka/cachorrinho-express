FROM --platform=linux/amd64 node:18-slim

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y openssl curl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3344
EXPOSE 5555

CMD ["yarn", "dev"]