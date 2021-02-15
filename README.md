# MU ACM Contest Software

[![Build Status](https://travis-ci.com/acm-mu/abacus.svg?branch=master)](https://travis-ci.com/acm-mu/abacus)

## Overview

This Open Source competition judging software is designed for the [Marquette ACM Programming Competition](https://mu.acm.org/competition). It was created my Marquette students, and modeled after [Kattis](https://www.kattis.com/), the judging software used for [ICPC](https://icpc.global/).

### Technology

- React
- Node.js
- AWS DynamoDB
- AWS EBS
- AWS Lambda
- AWS S3

## TODO

### Admin

- **STRETCH** Admin dashboard
- Refresh users page after adding new user
- Input validation for usernames, displaynames, and passwords for users
- Import users from a file
- View clarifications
- Close clarifications (no more replies)
- Delete clarifications
- Respond to clarifications

### Blue

- Download sample files
- Add submission "cooldown"
- Show most recent submission statistics on problem page
- View private & public clarifications
- Submit private clarifications
- Reply to private clarifications
- Get notified when clarification has been answered `(STRETCH)`
- Get notified when submission has been graded `(STRETCH)`
- Notifications for clarifications (async global javascript) `(STRETCH)`
- Notifications for results (async global javascript) `(STRETCH)`

### Gold

- View clarifications
- View standings
- Submit private clarifications
- Reply to private clarifications
- Get notified when clarification has been answered `(STRETCH)`
- Get notified when submission has been graded `(STRETCH)`

### Judge

- View solutions to problems
- View sample files for problems (skeletons, testdata)
- View unclaimed submissions
- Claim unclaimed submission
- Read-only claimed submissions
- Unclaim submissions
- View run output for submissions
- View clarifications
- Respond to clarifications
- Delete clarifications
- Close clarifications
- Reopen clarifications
- Submit public clarifications
- regrade submissions (only notify team if it has changed.) `(STRETCH)`

### Stretch Goal

Create aws_setup.py script to create DynamoDB tables, S3 buckets, and maybe lambda handlers to project can run out of the box with just aws credentials.

## Installation
