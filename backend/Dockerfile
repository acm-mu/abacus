# pull official base image
FROM node:18

ENV CHOKIDAR_USEPOLLING true

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn --silent
RUN yarn global add nodemon --silent

# add app
COPY . ./

EXPOSE 80

# run development server
CMD ["yarn", "dev"]