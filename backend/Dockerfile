FROM node

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --silent

RUN npm i -g nodemon

COPY . .

CMD ["yarn", "dev"]