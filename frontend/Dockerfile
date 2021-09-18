FROM node

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --silent

COPY . .

CMD ["yarn", "dev"]
