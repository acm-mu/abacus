# Custom AWS Lambda runtime: default bootstrap

A runtime is a program that runs a Lambda function's handler method when the function is invoked. This function includes a [Bash](https://www.gnu.org/software/bash/) runtime in the form of an executable file named `bootstrap`. Because the function's handler is `hello.handler`, the `handler()` function in the sample `hello.sh` file will be called. [Learn more](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html) about custom Lambda runtimes.

**NOTE**: The runtime can be included in your function's deployment package, or in a [layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html). If you later want to include a runtime layer on this function, make sure to delete the sample `bootstrap` file first.

## LAMBDA ACTION Worked Hopefully.....