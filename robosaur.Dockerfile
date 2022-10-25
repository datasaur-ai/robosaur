FROM node:16.18-alpine3.16

WORKDIR /home/robosaur
RUN bash -c 'mkdir -p ./{logs,config}'
COPY package*.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["/home/robosaur/entrypoint.sh"]
