# 🛠️ Backend — My Task App

This is the backend service for the **My Task App**, built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, structured inside an **Nx monorepo**.

---

## 📁 Project Structure

```
apps/backend/
├── prisma/ # Prisma schema and migrations
├── __integration-tests__ # integration tests for CRUD + validation
├── src/ # Express server and API routes
├── docs/ # Backend documentation
├── .env.test # Local environment variables (not committed)
├── .env.test.example # Example environment file
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

### 2. Create .env file in the root

Copy the example and update it as needed:

```
cp .env.example .env

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

### 5. Run the Backend Unit Tests + Integration Test

```
nx test backend
```

## 🧪 Integration Tests

Integration tests verify that the API endpoints work correctly with the database and application logic. These tests are located in:

```
apps/backend/__integration-tests__/
```

---

### ✅ What’s Covered

| Endpoint                | Description                       |
| ----------------------- | --------------------------------- |
| `POST /api/tasks`       | Create a new task with validation |
| `GET /api/tasks`        | Retrieve all tasks                |
| `PUT /api/tasks/:id`    | Update an existing task           |
| `DELETE /api/tasks/:id` | Delete a task                     |

These tests check both **valid use cases** and **error handling**, such as:

- Required field validation
- Field length constraints
- Invalid enum values
- Missing or malformed data
- 404 for non-existent resources

---

### Setup integration Tests

#### 1. 🛠️ Create Test Database with Docker

Create a separate PostgreSQL container for test isolation:

```
docker run --name task-db-test \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=my_task_test \
  -p 5433:5432 \
  -d postgres
```

#### 2. 📁 Setup .env.test File

```
cp apps/backend/.env.example apps/backend/.env.test
```

#### 3. Edit the contents of .env.test to include:

```
DATABASE_URL="postgresql://postgres:password@localhost:5433/my_task_test"
```

### 🚀 Running Integration Tests

- Use the following script to reset the database and run the tests:

```
npm run test:integration
```

This will:

1. Reset and apply migrations to the test DB
2. Run all \*.integration.ts tests

#### 🔧 Script Breakdown

- test:integration: Orchestrates reset + test run
- reset:testdb: Forces DB reset using test .env
- NODE_ENV=test: Activates test-specific behaviors
- jest.integration.config.ts: Targets integration test files only

---

## 🐳 Docker (Backend Only)

You can containerize and run the backend API using Docker, without relying on Nx.

### 🔨 1. Build the Docker Image

```
docker build -t my-task-backend ./apps/backend
```

### ▶️ 2. Run the Docker Container

```
docker run -p 5000:5000 --env-file .env my-task-backend

```

### ❌ 3. Stop & Remove Docker Container (Optional)

```
docker ps            # Find your container ID
docker stop <id>     # Stop it
docker rm <id>       # Remove it
```

## 📦 Tooling Summary

- Nx for monorepo management

- Express for building RESTful API

- Prisma for database ORM

- PostgreSQL as the relational DB

- dotenv-cli to manage environment variables

- Jest + supertest for tests (unit + integration)
- Docker for containerization
