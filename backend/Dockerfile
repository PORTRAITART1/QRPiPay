# Backend Dockerfile - FINAL FIXED VERSION

FROM node:20-alpine

WORKDIR /app

# Copy entire monorepo
COPY . .

# Change to backend directory for build
WORKDIR /app/backend

# Install all dependencies
RUN npm install

# Build TypeScript to dist/
RUN npm run build

# Copy Prisma to dist folder so it's found at runtime
RUN cp -r /app/database/prisma ./dist/

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3001

# Start from backend directory where dist exists
CMD ["node", "dist/server.js"]
