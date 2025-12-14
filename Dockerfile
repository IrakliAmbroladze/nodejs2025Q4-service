# Multi-stage build for smaller image size
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Create logs directory with proper permissions BEFORE switching to node user
RUN mkdir -p /app/logs && \
    chown -R node:node /app/logs

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy doc folder for Swagger
COPY --from=builder /app/doc ./doc

# Change ownership of all app files to node user
RUN chown -R node:node /app

# Expose port
EXPOSE 4000

# Set NODE_ENV
ENV NODE_ENV=production

# Run as non-root user for security
USER node

# Start application
CMD ["node", "dist/main"]
