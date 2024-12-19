# Build stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:all

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/migration.sql ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.html ./
COPY --from=builder /app/vite.config.ts ./

RUN npm install

# Start both frontend and backend
CMD npm run dev & npm start
