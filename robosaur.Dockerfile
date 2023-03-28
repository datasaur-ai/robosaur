FROM node:16.18-alpine3.16
ARG uid
ARG gid
RUN addgroup -S -g $gid user
RUN adduser -S -D -g '' -u $uid -G user user

RUN apk add --update bind-tools

WORKDIR /home/robosaur
RUN mkdir -p ./logs && mkdir -p ./config && mkdir -p ./state
COPY package*.json ./

RUN npm ci
COPY . .

RUN chown -R user:user /home/robosaur
USER user

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["/home/robosaur/entrypoint.sh"]