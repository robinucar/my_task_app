# 🧩 My Task App — Full Stack Project

---

## 👤 User Stories

This project is a single-user task management system, with no login or authentication required.

- **As a user**, I want to **create a new task** so that I can track what needs to be done.
- **As a user**, I want to **include a title** (required), and optionally a **description**, **due date**, and **status** when creating a task.
- **As a user**, I want to **view a list of all my tasks** so I can easily review them.
- **As a user**, I want to **sort my task list** by **due date** and **status** to stay organised.
- **As a user**, I want to **edit an existing task** to update its details when needed.
- **As a user**, I want to **delete a task** when it is no longer relevant.

---

## 🛠️ Tech Stack

A full-stack task management application built with:

- **Nx Monorepo**
- **React + Vite + TanStack Query (Frontend)**
- **Node.js + Express + Prisma + PostgreSQL (Backend)**
- **TypeScript** across the stack
- **Docker & Docker Compose** support
- **CI/CD with GitHub Actions**
- **Code quality enforced via Husky, Prettier, ESLint, Commitlint**

## 🧪 Test Stack

- **Jest** for unit testing
- **Cypress** for component testing

---

## 📚 Backend Documentation

For backend-specific setup, API reference, and Prisma usage, see:  
[`apps/backend/docs/README.md`](apps/backend/docs/README.md)

## 🐳 Docker Compose Setup

This project includes a fully containerized setup for the PostgreSQL database and backend API.

### 1. Copy and update the environment file:

```
cp .env.example .env
```

### 2. ▶️ Run the stack

To build and start all services:

```
docker compose up --build
```

### 3. 🌐 Access

- Backend API: http://localhost:5001/api/tasks
- Health Check: http://localhost:5001/health
- PostgreSQL: Accessible on port 5432
