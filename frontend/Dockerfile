# =============================================
# Frontend Dockerfile - MULTI-STAGE PRODUCTION
# =============================================
# Build Stage
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy monorepo
COPY package*.json ./
COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend

# Install dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy source
COPY frontend/src ./src
COPY frontend/index.html ./
COPY frontend/vite.config.ts ./
COPY frontend/tsconfig.json ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.cjs ./

# Build
RUN npm run build

# =============================================
# Runtime Stage - Minimal production image
FROM node:20-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install runtime dependencies
RUN apk add --no-cache curl dumb-init && \
    npm install -g serve

WORKDIR /app

# Copy only dist from builder
COPY --from=builder --chown=nodejs:nodejs /app/frontend/dist ./dist

# Switch to non-root user
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/index.html || exit 1

# Serve static files
CMD ["serve", "-s", "dist", "-l", "3000"]
