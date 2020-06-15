FROM node:12.16.3-alpine
ENV NODE_ENV production

# Install yarn Globaly
RUN apk -U upgrade && apk add yarn && apk add python && apk add make && apk add build-base

RUN npm install -g node-gyp nodemon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json/yarn.lock are copied
COPY ["package.json", "yarn.lock", "./"]

RUN yarn
# Bundle app source
COPY . .
EXPOSE 3000
CMD npm start