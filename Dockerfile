# Use an official Node.js image as the base image
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port that your Next.js app will run on (default is 3000)
EXPOSE 3000

# Set the command to run your application
CMD ["yarn", "start"]