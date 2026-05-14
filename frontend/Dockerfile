# Frontend Dockerfile - MONOREPO AWARE

FROM node:20-alpine

WORKDIR /app

# Copy ENTIRE monorepo
COPY . .

# Install and build from frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps && npm cache clean --force

# Build application
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Serve static files from dist directory
CMD ["serve", "-s", "dist", "-l", "3000"]
