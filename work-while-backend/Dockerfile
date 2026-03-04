# ============================================
# WorkWhile Backend - Multi-stage Dockerfile
# ============================================
# Uses Node 20 LTS with Chromium for Puppeteer scraping

# ---- Base ----
FROM node:20-bookworm-slim AS base

# Install Chromium & deps for Puppeteer (avoid downloading via npm = smaller, faster)
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer will use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create app user (non-root)
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# ---- Dependencies ----
FROM base AS deps

COPY package*.json ./

# Install only production deps (no devDependencies)
RUN npm install --omit=dev

# ---- Production image ----
FROM base AS runner

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create uploads directory (runtime)
RUN mkdir -p uploads/resumes uploads/portfolios

# Change ownership for uploads
RUN chown -R appuser:appuser /app

USER appuser

# Expose API port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Start the app
CMD ["node", "src/app.js"]
