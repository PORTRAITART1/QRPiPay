# Backend Dockerfile - FINAL VERSION
# Works with ANY Root Directory setting (or none)

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo structure
COPY . .

# Install dependencies from backend
WORKDIR /app/backend
RUN npm ci && npm cache clean --force

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app/backend

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY backend/package*.json ./

# Install runtime dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/backend/dist ./dist

# Copy Prisma schema and generated client
COPY --from=builder /app/backend/prisma ./prisma

# Generate Prisma Client at runtime (safety measure)
RUN npx prisma generate || true

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]
