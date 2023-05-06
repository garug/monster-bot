FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./

# This Dockerfile assumes `yarn build` already executed
# `tsc` uses more memory than I have on my vps laughing but crying
ADD dist ./dist

RUN yarn install --frozen-lockfile

# Run app
CMD ["yarn", "start"]

EXPOSE 8081
