# Frontend Dockerfile - FINAL VERSION
# Works with ANY Root Directory setting (or none)

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo structure
COPY . .

# Install and build from frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Stage 2: Runtime (static server)
FROM node:20-alpine

WORKDIR /app/frontend

# Install serve to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/frontend/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Serve static files
CMD ["serve", "-s", "dist", "-l", "3000"]
