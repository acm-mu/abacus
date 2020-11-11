FROM alpine:latest

# INSTALL PYTHON

RUN set -ex \
  && apk add --update --no-cache python3 \
  && ln -sf python3 /usr/bin/python \
  && python3 -m ensurepip

# SETUP APP

COPY . /app

WORKDIR /app

RUN pip3 install -r requirements.txt

ENTRYPOINT [ "python" ]

CMD [ "index.py" ]

EXPOSE 80