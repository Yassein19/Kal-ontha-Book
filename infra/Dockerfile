# Multi-stage Dockerfile for Kal Ontha (كأنثى)
# Builds Frontend & Runs Node.js Backend with Static Serving

FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy backend dependencies and source
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

COPY backend/ ./
COPY ingest/ /app/ingest/

# Copy built frontend into backend public dist
COPY --from=frontend-builder /app/frontend/dist /app/backend/public

EXPOSE 5000
CMD ["node", "src/server.js"]
