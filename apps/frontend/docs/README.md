## 🎨 Frontend — My Task App (React + TypeScript + Vite + Nx)

This is the frontend of the My Task App, built with React, TypeScript, and powered by Vite for fast development and builds. The project is structured inside an Nx monorepo and communicates with the backend via REST APIs.

## 📁 Project Structure

```
apps/frontend/
├── public/                       # Static assets
├── src/
│   ├── components/              # UI components
│   │   ├── TaskList.tsx         # Task table + sorting UI
│   │   ├── CreateTaskForm/      # Form for creating/editing tasks
│   │   ├── CreateTaskModal/     # Modal for task input
│   │   └── ConfirmDialog/       # Confirmation dialog for delete
│   ├── hooks/
│   │   └── useTasks.ts          # TanStack Query for task CRUD
│   ├── App.tsx                  # Main component: layout + state
│   ├── App.css                  # Global styles
│   └── main.tsx                 # Vite entry point
├── index.html                   # HTML template
├── vite.config.ts               # Vite config (Nx integrated)
├── tsconfig.json                # TypeScript settings
└── project.json                 # Nx frontend config
```

## 🚀 Features

- ✅ Create, edit, and delete tasks

- ✅ Client-side sorting (due date, status)

- ✅ Responsive and accessible UI

- ✅ Reusable modal and confirm components

- ✅ Built with React + TypeScript + Vite + TanStack Query

- ✅ Nx-managed monorepo with shared types

## ⚙️ Dev Setup

1. Install Dependencies (from root)

```
npm install
```

2. Create a .env file in apps/frontend

```
VITE_API_BASE_URL=http://localhost:5005/api
```

3. Start the Frontend (Vite Dev Server)

```
nx serve frontend
```

## 🎯 Component Overview

```
Component	Purpose
App.tsx	Handles layout, modal state, and sort logic
TaskList.tsx	Displays task table, handles sorting and action buttons
CreateTaskForm	Controlled form for task input
CreateTaskModal	Modal wrapper around the form
ConfirmDialog	Accessible confirmation dialog for delete actions
```

## 🧠 Data Fetching

- Powered by TanStack Query

- useTasks.ts handles:

  - Fetching all tasks

  - Creating, updating, deleting

  - Optimistic cache updates

🛠 Future Enhancements

- Pagination support

- Task filtering and search

- TailwindCSS or Chakra UI integration

- E2E tests (Cypress)

- Theming (dark mode)
