# todo-api-nest

A production-ready RESTful API for managing personal todos, built with **NestJS 11**, **Prisma 6**, and **PostgreSQL**. Features full JWT authentication, per-route rate limiting, input validation, and end-to-end tests.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Reference](#api-reference)
- [Security](#security)
- [Testing](#testing)
- [Scripts](#scripts)

---

## Features

- **JWT Authentication** — Sign up and sign in, receive a Bearer token
- **Full Todo CRUD** — Create, read, update, and delete personal tasks
- **Ownership Enforcement** — Users can only delete their own todos
- **Request Validation** — DTOs validated via `class-validator` with whitelist + transform
- **Rate Limiting** — Granular throttling per route via `@nestjs/throttler`
- **Security Headers** — HTTP headers hardened with `helmet`
- **Password Hashing** — `bcrypt` with 10 salt rounds
- **E2E Tests** — Auth flow tested with `supertest` and `@faker-js/faker`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth | JWT (`@nestjs/jwt`, `passport-jwt`) |
| Validation | class-validator, class-transformer |
| Security | Helmet, `@nestjs/throttler` |
| Password | bcrypt |
| Testing | Jest, Supertest, @faker-js/faker |

---

## Project Structure

```
src/
├── app.module.ts              # Root module — ThrottlerModule global setup
├── main.ts                    # Bootstrap — ValidationPipe + Helmet
│
├── auth/
│   ├── auth.controller.ts     # POST /api/auth/signup, /signin
│   ├── auth.service.ts        # signIn, signUp logic
│   ├── auth.module.ts
│   └── dto/
│       ├── sign-in.dto.ts
│       └── sign-up.dto.ts
│
├── todos/
│   ├── todos.controller.ts    # CRUD routes (all protected)
│   ├── todos.service.ts       # Business logic + ownership check
│   ├── todos.module.ts
│   └── dto/
│       ├── create-todo.dto.ts
│       └── update-todo.dto.ts
│
├── common/
│   ├── guards/
│   │   └── auth.guard.ts      # JWT verification via CanActivate
│   └── decoraters/
│       └── user.decorator.ts  # @User() — extracts userId from JWT payload
│
├── utils/
│   └── prisma.ts              # PrismaService (injectable singleton)
│
└── test/
    ├── auth.e2e-spec.ts        # Auth end-to-end tests
    └── fixture/
        ├── user.fixture.ts
        └── todo.fixture.ts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL running locally or a remote connection string

### Installation

```bash
git clone https://github.com/Omar-BEDev/todo-api-nest.git
cd todo-api-nest
npm install
```

---

## Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT="3000"
DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
JWT_SECRET="your_strong_jwt_secret"
```

---

## Database Setup

Run migrations to create the `User` and `Todo` tables:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

Optionally inspect your database in the browser:

```bash
npx prisma studio
```

### Schema Overview

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  nickName  String
  email     String   @unique
  password  String
  todos     Todo[]
  createdAt DateTime @default(now())
}

model Todo {
  id          String   @id @default(uuid())
  name        String
  description String
  isCompleted Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

---

## API Reference

### Auth — `POST /api/auth/*`

Auth routes are throttled to **5 requests per minute**.

#### Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Brahim",
  "nickName": "br4him",
  "email": "brahim@example.com",
  "password": "StrongPass@123"
}
```

**Response `201`**
```json
{ "access_token": "<jwt>" }
```

---

#### Sign In

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "brahim@example.com",
  "password": "StrongPass@123"
}
```

**Response `200`**
```json
{ "access_token": "<jwt>" }
```

---

### Todos — `* /api/todo/*`

All todo routes require a valid Bearer token:

```
Authorization: Bearer <access_token>
```

---

#### Create Todo

```http
POST /api/todo/createTask
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response `200`**
```json
{ "message": "create task succesfully" }
```

---

#### Get All Todos

```http
GET /api/todo/todos
Authorization: Bearer <token>
```

**Response `200`**
```json
{
  "todos": [
    {
      "name": "Buy groceries",
      "description": "Milk, eggs, bread",
      "createdAt": "2026-05-08T20:00:00.000Z"
    }
  ]
}
```

---

#### Update Todo

```http
PUT /api/todo/updateTask/:todoId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Buy groceries (updated)",
  "description": "Only milk"
}
```

**Response `200`**
```json
{ "message": "update todo succefully" }
```

---

#### Delete Todo

```http
DELETE /api/todo/deleteTodos/:todoId
Authorization: Bearer <token>
```

**Response `203`**
```json
{ "message": "Todo deleted succesfully" }
```

> Returns `403 Forbidden` if the todo belongs to another user.
> Returns `404 Not Found` if the todo does not exist.

---

## Security

| Mechanism | Details |
|---|---|
| JWT | Signed tokens, verified in `AuthGuard` via `JwtService.verifyAsync` |
| Helmet | Sets secure HTTP response headers on every request |
| bcrypt | Passwords hashed with 10 salt rounds before storage |
| Rate Limiting | Global: 100 req/60s · Auth + mutating Todo routes: 5 req/60s |
| Validation | `ValidationPipe` with `whitelist: true` strips unknown fields |
| Ownership | `deleteTask` checks `todo.userId === currentUserId` before deleting |

---

## Testing

The project uses **Jest** for end-to-end testing via `supertest`. Tests spin up a real NestJS application against a live PostgreSQL test database.

```bash
# Run e2e tests
npm run test:e2e
```

Test coverage includes:

- ✅ Valid sign up followed by sign in returns `access_token`
- ✅ Invalid sign up payload returns `400`
- ✅ Invalid sign in payload returns `400`

Fixture data is generated with `@faker-js/faker` via generator functions in `src/test/fixture/`.

---

## Scripts

```bash
npm run start         # Start in production mode
npm run start:dev     # Start with hot-reload (watch mode)
npm run start:debug   # Start with debug + watch
npm run build         # Compile to dist/
npm run lint          # Run ESLint with auto-fix
npm run format        # Run Prettier
npm run test          # Run unit tests
npm run test:cov      # Run tests with coverage report
npm run test:e2e      # Run end-to-end tests
```

---

## License

Private — all rights reserved.

