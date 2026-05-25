FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force
COPY tsconfig.json ./
COPY src ./src

FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
USER nodejs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 CMD curl -f http://localhost:3001/health || exit 1
CMD ["node", "src/server.js"]
