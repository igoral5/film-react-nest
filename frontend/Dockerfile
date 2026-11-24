# ---------- Сборка ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Адреса API и статики задаются на этапе сборки Vite.
# В продакшене всё раздаётся через nginx с того же домена, поэтому пути относительные.
ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_API_URL=$VITE_API_URL \
    VITE_CDN_URL=$VITE_CDN_URL

RUN npm run build

# ---------- Раздача ----------
# В финальном образе только собранная статика: её забирает nginx через volume.
FROM alpine:3.20 AS production
WORKDIR /app
COPY --from=build /app/dist ./dist

# Контейнер нужен только как источник статики для volume.
CMD ["sleep", "infinity"]
