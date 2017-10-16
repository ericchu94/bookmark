FROM node:latest

WORKDIR /usr/src/bookmark

COPY package.json .

COPY package-lock.json .

RUN ["npm", "install"]

COPY . .

EXPOSE 3000

ENTRYPOINT ["node", "."]
