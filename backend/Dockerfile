# Backend Dockerfile - FINAL WORKING VERSION
# Simple native Node.js deployment (not Docker multi-stage)

FROM node:20-alpine

WORKDIR /app

# Copy entire monorepo
COPY . .

# Change to backend directory
WORKDIR /app/backend

# Install dependencies
RUN npm install && npm cache clean --force

# Build TypeScript
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3001

# Start application
WORKDIR /app/backend
CMD ["npm", "start"]
