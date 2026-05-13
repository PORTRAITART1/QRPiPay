# Frontend Dockerfile - FINAL WORKING VERSION
# Simple native Node.js deployment (not Docker multi-stage)

FROM node:20-alpine

WORKDIR /app

# Copy entire monorepo
COPY . .

# Change to frontend directory
WORKDIR /app/frontend

# Install dependencies
RUN npm install && npm cache clean --force

# Build application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Serve static files
CMD ["serve", "-s", "dist", "-l", "3000"]
