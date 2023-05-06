FROM node as builder

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN npm install typescript -g

RUN yarn install --frozen-lockfile

COPY . .

# Build project
RUN yarn build

# Run app
CMD ["yarn", "start"]

EXPOSE 8081
