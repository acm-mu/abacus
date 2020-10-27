FROM alpine:latest

# INSTALL PYTHON

RUN set -ex \
  && apk add --update --no-cache python3 \
  && ln -sf python3 /usr/bin/python \
  && python3 -m ensurepip

# INSTALL JAVA 8

RUN apk add --update --no-cache openjdk8
ENV PATH "/usr/lib/jvm/java-1.8-openjdk/bin:${PATH}"

# INSTALL GCC

RUN  apk add --update --no-cache gcc \
  && apk add --update --no-cache libc-dev

# SETUP APP

COPY . /app

WORKDIR /app

RUN pip3 install -r requirements.txt

ENTRYPOINT [ "python" ]

CMD [ "index.py" ]

EXPOSE 80