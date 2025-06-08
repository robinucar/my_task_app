# 📦 Shared Types — My Task App

This library contains TypeScript types and enums used across the **My Task App**, shared between backend and (optionally) frontend services in the Nx monorepo.

## 📁 Project Structure

```
libs/shared/types/
├── src/
│ ├── lib/
│ │ ├── task.types.ts # Task-related types and enums
│ │ └── shared-types.spec.ts # Unit tests for type behavior
│ └── index.ts # Barrel export
```

---

## 📘 Available Types

### 🔹 `TaskStatus` (enum)

Represents the valid states of a task:

```
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
```

### 🔹 CreateTaskInput

Shape for creating a new task:

```
export type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
};
```

- 📝 status is optional and defaults to PENDING on the backend.

### 🔹 UpdateTaskInput

Shape for updating an existing task. All fields are optional:

```
export type UpdateTaskInput = Partial<CreateTaskInput>;
```

## 📦 Usage

To use in other libraries or apps (e.g., backend, frontend):

```
import { CreateTaskInput, UpdateTaskInput } from '@shared-types';
```

## ✅ Benefits

📚 Centralized type definitions

🤝 Shared between backend and frontend

🔍 Type-safe API contracts

🧩 Easy to extend
