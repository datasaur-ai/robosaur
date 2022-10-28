FROM node:16.18-alpine3.16

WORKDIR /home/robosaur
RUN mkdir -p ./logs && mkdir -p ./config && mkdir -p ./state
COPY package*.json ./
RUN npm ci
COPY . .

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["/home/robosaur/entrypoint.sh"]
