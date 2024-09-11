# Stage 1: Build the Next.js application
FROM --platform=linux/amd64 node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Serve the Next.js application
FROM --platform=linux/amd64 node:18-alpine AS runner

WORKDIR /app

# Copy the build output and dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000 to the host
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
