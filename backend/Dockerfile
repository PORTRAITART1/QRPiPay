# Backend Dockerfile - ABSOLUTE PATHS VERSION

FROM node:20-alpine

WORKDIR /app

# Copy ENTIRE monorepo
COPY . .

# Install dependencies from backend
WORKDIR /app/backend
RUN npm install --legacy-peer-deps && npm cache clean --force

# Build TypeScript
RUN npm run build

# Copy Prisma schema and migrations to dist using ABSOLUTE paths
RUN mkdir -p ./dist/lib/prisma && \
    cp /app/database/prisma/schema.prisma ./dist/lib/prisma/ && \
    cp -r /app/database/prisma/migrations ./dist/lib/prisma/

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start application
CMD ["node", "dist/server.js"]
