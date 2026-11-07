# syntax=docker/dockerfile:1.7

# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN chmod -R +x node_modules/.bin 2>/dev/null || true
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install only what's required to run the Express server (tsx + runtime deps)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm install --no-save tsx

# Copy built assets and server entrypoint
COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY tsconfig.json ./

# Non-root user
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app
USER app

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3001/api/health || exit 1

CMD ["npx", "tsx", "server.ts"]
