FROM node

# Create app directory
WORKDIR /app

# Copy necessary files
COPY package.json yarn.lock .env ./

# This Dockerfile assumes `yarn build` already executed
# `tsc` uses more memory than I have on my vps laughing but crying
ADD dist ./dist

RUN yarn install --frozen-lockfile

# Run app
CMD ["yarn", "start"]

EXPOSE 8081
