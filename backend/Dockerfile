FROM node

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --silent

RUN yarn global add nodemon

COPY . .

CMD ["yarn", "dev"]