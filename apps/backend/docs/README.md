# 🛠️ Backend — My Task App

This is the backend service for the **My Task App**, built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, structured inside an **Nx monorepo**.

---

## 📁 Project Structure

```
apps/backend/
├── prisma/ # Prisma schema and migrations
├── src/ # Express server and API routes
├── docs/ # Backend documentation
├── .env # Local environment variables (not committed)
├── .env.example # Example environment file
└── project.json # Nx project config
```

---

## ⚙️ Environment Setup

### 1. Start PostgreSQL with Docker

```
docker run --name task-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=taskmanager \
  -p 5432:5432 \
  -d postgres
```

### 2. Create .env file

Copy the example and update it as needed:

```
cp apps/backend/.env.example apps/backend/.env
```

Ensure it contains:

```
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
```

### 3. Prisma Setup

- Schema Location:
  apps/backend/prisma/schema.prisma

- Task Model:

```
model Task {
  id          String      @id @default(cuid())
  title       String
  description String?     @db.Text
  dueDate     DateTime?
  status      TaskStatus  @default(PENDING)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

#### Run migration

```
npm run prisma:migrate
```

#### Generate Prisma Client

```
npm run prisma:generate
```

### 4. Run the Backend

```
nx serve backend
```

## 📦 Tooling Summary

- Nx for monorepo management

- Express for building RESTful API

- Prisma for database ORM

- PostgreSQL as the relational DB

- dotenv-cli to manage environment variables

- Jest for tests (setup in progress)
