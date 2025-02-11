FROM node:20.11.0-slim

RUN apt-get update && \
    apt-get install -y locales vim
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata
RUN locale-gen ja_JP.UTF-8
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo
EXPOSE 8080