FROM node:18-alpine

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app

# Install production dependencies first for better layer caching
COPY package.json ./
RUN npm install --omit=dev

# Application code
COPY addon.js ./
COPY lib ./lib
COPY utils ./utils

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["node", "addon.js"]
