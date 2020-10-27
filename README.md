# MU ACM Contest Software
## Overview
To be written.

### Technology
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Python Package)
* [MongoDB](https://www.mongodb.com/) (Database)
* (Optional) [AWS S3](https://aws.amazon.com/s3/) (File Storage)

## How to run locally

#### Dependencies 
* [Docker](https://docs.docker.com/get-started/overview/) w/ [Docker Compose](https://docs.docker.com/compose/)
    
All you need to do is run `docker-compose up -d` from the main directory. 
      
  * The `-d` flag will run the containers in the background.
  * To view the output you can run `docker logs kattis_app` (`--follow` will continue streaming the new output).

This command will spin up a flask container as well as a local mongo db container running in tandem. You can configure credentials from within the `docker-compose.yml` file. Just make sure you change the credentials in both places.

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