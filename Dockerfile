FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["node", "dist/main"]