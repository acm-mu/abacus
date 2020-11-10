# MU ACM Contest Software
## Overview
To be written.

### Technology
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Python Package)
* [AWS DynamoDB](https://aws.amazon.com/dynamodb/) (Database)
* [AWS S3](https://aws.amazon.com/s3/) (File Storage)
* [AWS EC2](https://aws.amazon.com/ec2/) (Hosting)
* [AWS Lambda](https://aws.amazon.com/lambda/) (Event Driven Processes)

## How to run locally

#### Dependencies 
* [Docker](https://docs.docker.com/get-started/overview/) w/ [Docker Compose](https://docs.docker.com/compose/)
    
All you need to do is run `docker-compose up -d` from the main directory. 
      
  * The `-d` flag will run the containers in the background.
  * To view the output you can run `docker logs kattis_app` (`--follow` will continue streaming the new output).

This command will spin up a flask container as well as a local mongo db container running in tandem. You can configure credentials from within the `docker-compose.yml` file. Just make sure you change the credentials in both places.
