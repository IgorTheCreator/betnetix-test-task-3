FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine

COPY —from=builder /usr/src/app/node_modules ./node_modules/
COPY —from=builder /usr/src/app/package*.json ./
COPY —from=builder /usr/src/app/dist ./dist/
COPY —from=builder /usr/src/app/prisma ./prisma/


EXPOSE 3000

CMD ["npm", "run", "start:migrate:docker"]