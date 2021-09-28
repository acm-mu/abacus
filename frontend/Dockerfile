# pull official base image
FROM node

ENV CHOKIDAR_USEPOLLING true

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn --silent
RUN yarn global add react-scripts --silent

# add app
COPY . ./

EXPOSE 3000

# start dev server
CMD ["yarn", "dev"]
