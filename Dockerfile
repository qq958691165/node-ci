FROM node
MAINTAINER jack "958691165@qq.com"

#时区设置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

RUN mkdir -p /root/node-ci

WORKDIR "/root/node-ci"

COPY . .

RUN npm install

ENTRYPOINT node index.js