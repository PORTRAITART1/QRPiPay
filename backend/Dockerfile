# ============================================
# Backend Dockerfile - MULTI-STAGE PRODUCTION
# ============================================
# Build Stage - Compile dependencies
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy root and backend package files
COPY package*.json ./
COPY backend/package*.json ./backend/

WORKDIR /app/backend

# Install production dependencies
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# ============================================
# Runtime Stage - Minimal production image
FROM node:20-alpine

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install runtime dependencies
RUN apk add --no-cache curl dumb-init

WORKDIR /app

# Copy node_modules and source from builder
COPY --from=builder --chown=nodejs:nodejs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/backend/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/backend/package.json ./

# Switch to non-root user
USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Run server
CMD ["node", "src/server.js"]
