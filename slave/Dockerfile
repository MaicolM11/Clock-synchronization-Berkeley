FROM node
WORKDIR /usr/src/app
COPY . .

RUN apt update
RUN npm install
CMD node index.js