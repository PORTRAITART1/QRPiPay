# Backend Dockerfile - MONOREPO AWARE

FROM node:20-alpine

WORKDIR /app

# Copy ENTIRE monorepo structure (backend + database + frontend)
COPY . .

# Install dependencies from backend
WORKDIR /app/backend
RUN npm install --legacy-peer-deps && npm cache clean --force

# Build TypeScript
RUN npm run build

# Prisma MUST be available at runtime - it's in ../database/prisma
# Copy to dist so imports work
RUN mkdir -p ./dist/lib && cp -r ../database/prisma ./dist/lib/

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start application
CMD ["node", "dist/server.js"]
