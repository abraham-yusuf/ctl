FROM node:16-buster as builder

RUN apt-get install g++ make python3
RUN wget https://dl.google.com/go/go1.13.linux-amd64.tar.gz && tar -C /usr/local -xzf go1.13.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin

RUN mkdir /app
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

RUN yarn build:linux


