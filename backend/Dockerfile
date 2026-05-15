FROM node:20-alpine
WORKDIR /app
COPY . .
WORKDIR /app/backend
RUN npm install --legacy-peer-deps && npm cache clean --force
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/server.js"]
