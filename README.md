# Telegram Chat Clone

Простой клон чата Telegram для одного пользователя.
Стек: React + TypeScript + Tailwind CSS + Vite (фронтенд), FastAPI (бэкенд), Docker + Docker Compose.

## Запуск локально (рекомендуется)

```bash
docker compose up --build
```

Фронтенд: http://localhost:3000
API: http://localhost:8000

## Запуск без Docker
Бэкенд:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Фронтенд:
```bash
cd frontend
npm install
npm run dev
```

## API

| Метод   | Эндпоинт        | Описание                   |
|---------|-----------------|----------------------------|
| GET     | `/api/messages` | Получить все сообщения     |
| POST    | `/api/messages` | Отправить новое сообщение  |
| DELETE  | `/api/messages` | Очистить все сообщения     |




