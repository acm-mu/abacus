# MU ACM Contest Software

## Overview

This Open Source competition judging software is designed for the [Marquette ACM Programming Competition](https://mu.acm.org/competition). It was created by Marquette students, and modeled after [Kattis](https://www.kattis.com/), the judging software used for [ICPC](https://icpc.global/).

### Technology

- [React](https://reactjs.org/)
  - [Semantic UI React](https://react.semantic-ui.com/)
  - [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
  - [React Moment](https://github.com/headzoo/react-moment)
  - [Monaco Editor](https://microsoft.github.io/monaco-editor)
  - [Markdown Editor](https://uiwjs.github.io/react-md-editor)
- [Node.js](https://nodejs.org/en/)
  - [Express.js](https://expressjs.com/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [MongoDB](https://www.mongodb.com/)
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS S3](https://aws.amazon.com/s3/)
- [engineer-man/piston](https://github.com/engineer-man/piston)

## Local Development

#### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [git](https://git-scm.com/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) 

#### Installation
- Clone this repo 
- Run sudo docker-compose up
- After docker-compose from the terminal, open a new web browser window to `localhost:3000`

### Creating a new branch
- in your terminal/powershell, cd to the root of your abacus clone
- git checkout master
- git pull 
- git checkout -b initials-issue# (example - jd-101) 

After doing this, you should have your own branch created, and can now start working on changes!

## Project Board

[View project board here](https://github.com/acm-mu/abacus/projects/1)
