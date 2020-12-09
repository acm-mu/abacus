# MU ACM Contest Software

[![Build Status](https://travis-ci.com/acm-mu/abacus.svg?branch=master)](https://travis-ci.com/acm-mu/abacus)

## Overview
This Open Source competition judging software is designed for the [Marquette ACM Programming Competition](https://mu.acm.org/competition). It was created my Marquette students, and modeled after [Kattis](https://www.kattis.com/), the judging software used for [ICPC](https://icpc.global/).

### Technology
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Python Package)
* [AWS DynamoDB](https://aws.amazon.com/dynamodb/) (Database)
* [AWS S3](https://aws.amazon.com/s3/) (File Storage)
* [AWS EC2](https://aws.amazon.com/ec2/) (Hosting)
* [AWS Lambda](https://aws.amazon.com/lambda/) (Event Driven Processes)

## TODO
 ### Admin
- [ ] Admin dashboard
- [x] View users
- [x] Create users (team, judge & admin)
- [ ] Delete users
- [x] Update users
- [ ] Export users to a file
- [ ] Import users from a file
- [ ] Delete user submissions when user is deleted
- [x] View problems
- [x] Create new problems
- [x] Delete problems
- [ ] Delete problem submissions when problem is deleted
- [x] Update problems
- [x] Upload solution for problems (either DynamoDB or S3 bucket)
- [x] Upload sample files (sample runs, skeletons) for problems (either DynamoDB or S3 bucket)
- [ ] Delete submissions
- [ ] View clarifications
- [ ] Close clarifications (no more replies)
- [ ] Delete clarifications
- [ ] Respond to clarifications
- [ ] Re-grade submissions

 ### Blue
- [ ] View problems
- [ ] Download sample files
- [x] Submit problems
- [ ] Disable submitting problems before and after competition
- [ ] Prevent resubmitting solved problems
- [ ] View submissions
- [ ] View standings
- [ ] View private & public clarifications 
- [ ] Submit private clarifications
- [ ] Reply to private clarifications
- [ ] Get notified when clarification has been answered `(STRETCH)`
- [ ] Get notified when submission has been graded `(STRETCH)`
- [ ] Notifications for clarifications (async global javascript) `(STRETCH)`
- [ ] Notifications for results (async global javascript) `(STRETCH)`

 ### Gold
- [ ] Connect scratch username to user
- [ ] View problems
- [ ] Submit problems (from scrath url)
- [ ] View submissions
- [ ] View clarifications
- [ ] View standings
- [ ] Submit private clarifications
- [ ] Reply to private clarifications
- [ ] Get notified when clarification has been answered `(STRETCH)`
- [ ] Get notified when submission has been graded `(STRETCH)`

 ### Judge
- [x] View problems
- [ ] View solutions to problems
- [ ] View sample files for problems (skeletons, testdata)
- [ ] View unclaimed submissions
- [ ] Claim unclaimed submission
- [ ] Read-only claimed submissions
- [ ] Unclaim submissions
- [ ] View run output for submissions
- [ ] View clarifications
- [ ] Respond to clarifications
- [ ] Delete clarifications
- [ ] Close clarifications
- [ ] Reopen clarifications
- [ ] Submit public clarifications
- [ ] regrade submissions (only notify team if it has changed.) `(STRETCH)`

### Stretch Goal
Create aws_setup.py script to create DynamoDB tables, S3 buckets, and maybe lambda handlers to project can run out of the box with just aws credentials.

## Installation

1. Clone repository to your machine.

    `$ git clone git@github.com:acm-mu/abacus`

2. Configure environment variables in .env
  - `FLASK_APP`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`
3. Create & activate virtualenv in repository. (Optional, but recommended)

    `$ virtualenv venv && source venv/bin/activate`

4. Install python dependencies.

    `$ pip install -r requirements.txt`

5. Start application.
 
   `$ flask run`

6. Navigate to `localhost:5000`

# Asynchronous Forms
Abacus takes advantage of submitting forms asynchronous rather than the default redirect behavior.

For Example:
```html
<form method="POST" action="doSubmitAction.php" async>
...
</form>
```

By defaeult, this form would redirect to `doSubmitAction.php` when the form is submitted (with the data in the headers).

For Abacus, you define your form the same way, but when the client submits, the POST request will be ran asynchronously and the client is not redirected.

The main reason it is implemented like this is to define a single endpoint for reading and writing data (`/api`) and not having to send the client there with a redirect.
