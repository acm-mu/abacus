# MU ACM Contest Software
## Overview
This Open Source competition judging software is designed for the [Marquette ACM Programming Competition](https://mu.acm.org/competition). It was created my Marquette students, and modeled after [Kattis](https://www.kattis.com/), the judging software used for [ICPC](https://icpc.global/).

### Technology
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Python Package)
* AWS DynamoDB, S3, EC2, and Lambda

## How to run locally

Instructions need to be rewritten.

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