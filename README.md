# FILM!

Сервис по продаже билетов в кино.

- `backend` — NestJS + TypeORM + PostgreSQL, документация API: `/api/docs`
- `frontend` — React + Vite
- `nginx` — раздача фронтенда и проксирование `/api/` и `/content/` в бэкенд

## Деплой

Приложение развёрнуто на сервере: **https://igoral.nomorepartiessite.ru**

## Запуск локально в Docker

```bash
cp .env.example .env
docker compose up -d --build
```

- приложение — http://localhost
- pgAdmin — http://localhost:8080 (логин и пароль из `.env`)
- подключение в pgAdmin: host `database`, port `5432`, база, пользователь и пароль из `.env`

Таблицы и тестовые данные создаются автоматически при первом запуске контейнера с базой
(скрипты из `backend/test` и `database/init.sql`).

Остановить: `docker compose down`, удалить вместе с данными: `docker compose down -v`.

## Разработка без Docker

### Бэкенд

```bash
cd backend
npm ci
cp .env.example .env      # укажите свой DATABASE_URL
npm run start:debug
```

### Фронтенд

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev
```

## Переменные окружения

Все переменные описаны в `.env.example`:

| Переменная | Назначение |
| --- | --- |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | параметры базы данных |
| `DATABASE_DRIVER`, `DATABASE_URL` | подключение бэкенда к базе |
| `NODE_ENV` | окружение бэкенда |
| `LOGGER` | формат логов: `dev` (по умолчанию), `json`, `tskv` |
| `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD` | доступ в pgAdmin |

## Логирование

В бэкенде три логгера:

- `DevLogger` — цветной `ConsoleLogger` Nest для разработки;
- `JsonLogger` — каждая запись в виде JSON-объекта;
- `TskvLogger` — формат TSKV (поля через табуляцию).

Логгер выбирается переменной `LOGGER`. Если она не задана, используется `dev`,
а при `NODE_ENV=production` — `json`.

## Тесты и линт

```bash
cd backend
npm test
npm run lint
```

## Публикация образов

GitHub Actions (`.github/workflows/docker-publish.yml`) при пуше в `main` собирает образы
и публикует их в GitHub Container Registry:

- `ghcr.io/igoral5/film-react-nest-backend:latest`
- `ghcr.io/igoral5/film-react-nest-frontend:latest`
- `ghcr.io/igoral5/film-react-nest-nginx:latest`

## Обновление приложения на сервере

В директории проекта на сервере (`~/film`) лежат `docker-compose.prod.yml`, `.env`,
`database/init.sql`, `backend/test/*.sql` и `certbot/` с сертификатами.

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

pgAdmin наружу не открыт, доступ к нему через SSH-туннель:

```bash
ssh -L 8080:localhost:8080 igor@igoral.nomorepartiessite.ru
```

Дальше — http://localhost:8080.
