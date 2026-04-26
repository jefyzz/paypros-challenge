# TaskManager

A full-stack task management application built with **NestJS**, **Prisma**, **MySQL**, **React**, and **TypeScript**. Users can register, log in, and perform full CRUD operations on their personal tasks — all secured with JWT authentication.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Start the Database](#1-start-the-database)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Technical Decisions](#technical-decisions)

---

## Overview

TaskManager allows authenticated users to:

- **Register / Login** with email and password
- **Create** tasks with a title, description, due date, and status
- **List** all their tasks, filtered by `pending` or `completed`
- **Update** task details and toggle status between `pending` and `completed`
- **Delete** tasks with a confirmation step

Tasks are private — each one is scoped to the authenticated user. Unauthenticated requests to protected endpoints are rejected with a `401 Unauthorized` response.

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 20 | Runtime |
| NestJS | 11 | REST API framework (modular, DI-based) |
| Prisma | 7 | Type-safe ORM |
| MySQL | 8 | Relational database |
| Passport + JWT | — | Stateless authentication |
| class-validator | — | DTO validation |
| bcrypt | — | Password hashing |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| TypeScript | 6 | Static typing |
| Tailwind CSS | 3 | Utility-first styling |
| React Router | 7 | Client-side routing |
| Axios | — | HTTP client with interceptors |
| react-hot-toast | — | Toast notifications |
| Vite | 8 | Dev server & bundler |

---

## Architecture

```
┌─────────────────────────────────┐     HTTP/REST
│           React Frontend        │ ──────────────►  NestJS API (:3000)
│   (Vite dev server :5173)       │ ◄──────────────
└─────────────────────────────────┘   JSON responses
                                            │
                                            │ Prisma ORM
                                            ▼
                                     MySQL Database
                                       (:3306)
```

### Authentication Flow

```
Client                   NestJS API                    MySQL
  │                           │                           │
  │── POST /auth/register ───►│                           │
  │                           │── INSERT user ───────────►│
  │                           │◄─ user record ────────────│
  │◄── { accessToken, user } ─│                           │
  │                           │                           │
  │── POST /auth/login ──────►│                           │
  │                           │── SELECT user ───────────►│
  │                           │◄─ user record ────────────│
  │                           │   bcrypt.compare()        │
  │◄── { accessToken, user } ─│                           │
  │                           │                           │
  │── GET /tasks              │                           │
  │   Authorization: Bearer…─►│                           │
  │                           │  JwtStrategy.validate()   │
  │                           │── SELECT tasks ──────────►│
  │◄── [ Task[] ] ────────────│                           │
```

### Key Design Patterns

- **Global PrismaModule** (`@Global()`) — `PrismaService` is injected into any module without re-importing.
- **Global ConfigModule** — `@nestjs/config` reads `.env` at startup; all modules consume via `ConfigService`.
- **Global ValidationPipe** — `whitelist: true` strips unknown fields; `transform: true` auto-converts types.
- **Global HttpExceptionFilter** — all errors return a consistent `{ statusCode, message, error, path, timestamp }` shape.
- **Ownership enforcement** — every task mutation verifies `task.userId === currentUser.id` before proceeding, throwing `ForbiddenException` otherwise.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for MySQL)
- [Postman](https://www.postman.com/) (optional, for API testing)

### 1. Start the Database

```bash
# From the project root
docker-compose up -d
```

This starts a MySQL 8 container on port `3306` with the `taskmanager` database.

### 2. Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env
# Edit .env if you changed the Docker Compose credentials

# Install dependencies
npm install

# Run database migration (creates tables)
npx prisma migrate dev --name init

# Start the development server
npm run start:dev
```

The API will be available at **http://localhost:3000**.

### 3. Frontend Setup

```bash
cd frontend

# Copy environment variables
cp .env.example .env  # or just create .env with VITE_API_BASE_URL=http://localhost:3000

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

> **API Testing (optional):** Import `backend/postman/TaskManager.postman_collection.json` and `backend/postman/Local.postman_environment.json` into Postman to test all endpoints. Run them in order via the Collection Runner — the Login request auto-sets the `accessToken` variable.

---

## API Reference

All `/tasks` endpoints and `GET /auth/profile` require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ✗ | Register a new user. Returns `{ accessToken, user }`. |
| `POST` | `/auth/login` | ✗ | Log in. Returns `{ accessToken, user }`. |
| `GET` | `/auth/profile` | ✓ | Get the authenticated user's profile. |

**Register / Login body:**

```json
{
  "email": "user@example.com",
  "name": "Jane Doe",       // register only
  "password": "mypassword"
}
```

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/tasks` | ✓ | List all tasks. Optional `?status=pending\|completed`. |
| `GET` | `/tasks/:id` | ✓ | Get a single task by ID. |
| `POST` | `/tasks` | ✓ | Create a task. Returns `201`. |
| `PATCH` | `/tasks/:id` | ✓ | Update a task (partial). |
| `DELETE` | `/tasks/:id` | ✓ | Delete a task. Returns `204`. |

**Task body (all fields except `title` are optional):**

```json
{
  "title": "Finish the report",
  "description": "Q4 financial summary",
  "dueDate": "2026-05-15T00:00:00.000Z",
  "status": "pending"
}
```

**Task status values:** `"pending"` | `"completed"` (strictly enforced by `@IsIn` validation).

### Error Response Shape

All errors follow this consistent format:

```json
{
  "statusCode": 404,
  "message": "Task with ID \"abc\" not found",
  "error": "Not Found",
  "path": "/tasks/abc",
  "timestamp": "2026-04-26T17:00:00.000Z"
}
```

---

## Project Structure

```
paypros-challenge/
├── docker-compose.yml            # MySQL 8 service
├── .env.example                  # Root env template
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # User + Task models
│   ├── prisma.config.ts          # Prisma v7 datasource config
│   ├── postman/
│   │   ├── TaskManager.postman_collection.json
│   │   └── Local.postman_environment.json
│   └── src/
│       ├── main.ts               # Bootstrap: pipes, filters, CORS
│       ├── app.module.ts         # Root module composition
│       ├── prisma/               # Global PrismaModule + PrismaService
│       ├── auth/
│       │   ├── dto/              # RegisterDto, LoginDto
│       │   ├── guards/           # JwtAuthGuard
│       │   ├── strategies/       # JwtStrategy (passport-jwt)
│       │   ├── decorators/       # @CurrentUser()
│       │   ├── auth.service.ts   # register(), login()
│       │   ├── auth.controller.ts
│       │   └── auth.module.ts
│       ├── tasks/
│       │   ├── dto/              # CreateTaskDto, UpdateTaskDto
│       │   ├── tasks.service.ts  # CRUD with ownership checks
│       │   ├── tasks.controller.ts
│       │   └── tasks.module.ts
│       └── common/
│           └── filters/          # HttpExceptionFilter
│
└── frontend/
    └── src/
        ├── api/                  # axios.ts, auth.api.ts, tasks.api.ts
        ├── context/              # AuthContext + AuthProvider
        ├── hooks/                # useAuth, useTasks
        ├── components/
        │   ├── layout/           # AppLayout, ProtectedRoute
        │   ├── ui/               # Button, Input, Modal, Badge, EmptyState
        │   └── tasks/            # TaskList, TaskCard, TaskFilters,
        │                         # TaskFormModal, DeleteConfirmModal
        └── pages/                # LoginPage, RegisterPage, DashboardPage
```

---

## Technical Decisions

### Why a Global `PrismaModule`?
Marking `PrismaModule` as `@Global()` means `PrismaService` is registered once and available everywhere without being explicitly imported into every feature module. This follows the same pattern NestJS uses for `ConfigModule`.
