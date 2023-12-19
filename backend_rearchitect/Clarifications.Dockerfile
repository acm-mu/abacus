# Use an official Node.js runtime as a base image
FROM node:21

ENV CHOKIDAR_USEPOLLING true

# Set the working directory in the container
WORKDIR /app/Clarifications

# Copy the application files to the working directory
COPY Clarifications .
COPY Shared ../Shared

# Install app dependencies
RUN yarn --silent
RUN yarn global add nodemon --silent

# Expose the port that your application is running on
EXPOSE 8080

# Run development server
CMD ["yarn", "dev"]