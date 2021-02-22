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
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS S3](https://aws.amazon.com/s3/)
- [engineer-man/piston](https://github.com/engineer-man/piston)

## Local Development

#### Prerequisites

- [Node.js](https://nodejs.org/en/)

#### Installation

- Clone this repo.
- Navigate to the `backend` directory
- Run `npm install` to install backend node dependencies
- Navigate to `frontend` directory
- Run `npm install` to install frontend node dependencies
- Backend and frontend run as two separate processes. You have two choices here
  - From the repo root directory, open one terminal and run `npm run dev`
  - Open two terminals (or command prompt). In one terminal run `npm start` from the `frontend` directory and in the other terminal, run `npm run dev` from the `backend` directory.
- After running the frontend (either way) the terminal should open a new web browser window to `localhost:3000`

## TODO

[View project board here](https://github.com/acm-mu/abacus/projects/1)
