# pull official base image
FROM node

ENV CHOKIDAR_USEPOLLING true

# Setup Piston Runner
# set working directory
WORKDIR /PistonRunner

# install dependencies
COPY ../PistonRunner/package.json ./
COPY ../PistonRunner/yarn.lock ./
RUN yarn --silent

# add script
COPY ../PistonRunner/PistonRunner.js ./


# Setup Spoofer 
# set working directory
WORKDIR /app

# install app dependencies
COPY spoofer/package.json ./
COPY spoofer/yarn.lock ./
RUN yarn --silent
RUN yarn global add nodemon --silent

# add app
COPY spoofer/service.js ./

# Start Spoofer
EXPOSE 6000

# run development server
CMD ["yarn", "dev"]