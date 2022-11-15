FROM node:18

MAINTAINER nick@addosolutions.com



WORKDIR /app

ADD package.json /app/
RUN npm install --production

ADD . /app
VOLUME /app/lib/tasks/cache/

CMD node index.js --docker