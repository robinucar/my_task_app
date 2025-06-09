# --- Stage 1: Build + Prisma Generate ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./

# Copy backend app and prisma schema
COPY apps/backend apps/backend
COPY apps/backend/prisma apps/backend/prisma
COPY libs libs

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Build backend with Nx
RUN npx nx build backend

# --- Stage 2: Production Image ---
FROM node:20-alpine

WORKDIR /app

# Copy built app only
COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json


EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/apps/backend/main.js"]
