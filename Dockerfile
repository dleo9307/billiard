FROM node:6
COPY package.json /billiard/package.json
RUN  cd /billiard; npm install
COPY . /billiard
EXPOSE 3000
WORKDIR /billiard

CMD node index.js