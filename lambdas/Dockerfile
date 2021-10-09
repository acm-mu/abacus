# pull official base image
FROM node

ENV CHOKIDAR_USEPOLLING true

# set working directory
WORKDIR /app

# install app dependencies
COPY spoofer/package.json ./
COPY spoofer/yarn.lock ./
RUN yarn --silent
RUN yarn global add nodemon --silent

# add app
COPY spoofer/service.js ./
COPY ../PistonRunner /PistonRunner

EXPOSE 6000

# run development server
CMD ["yarn", "dev"]