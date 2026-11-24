# ---------- Сборка ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Запуск ----------
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Только production-зависимости, без исходников и dev-зависимостей.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY public ./public

EXPOSE 3000
CMD ["node", "dist/main"]
