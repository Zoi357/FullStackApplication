# Full-Stack App Prototype

A static front-end prototype simulating a full-stack application with role-based access, user authentication, and basic CRUD operations — all without a backend, using `localStorage` for persistence.

## Features

- User registration and login
- Role-based UI (Admin / User)
- Persistent data via `localStorage`
- CRUD for Employees and Departments (Admin only)
- My Requests section (User)
- Accounts management (Admin only)

## Roles

| Role  | Access |
|-------|--------|
| Admin | Home, Employees, Departments, My Requests, Profile, Accounts |
| User  | Home, My Requests, Profile |

## Default Accounts

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin123 | Admin |
| user1    | 123user  | User  |
| user2    | user123  | User  |

## How to Run

1. Open `index.html` directly in Chrome, or
2. Use VS Code / Kiro Live Server — right-click `index.html` → Open with Live Server

No build step or dependencies required.

## Project Structure

```
fullstackprototype/
├── index.html      # Main HTML structure and all sections
├── script.js       # App logic, auth, CRUD, localStorage
├── styles.css      # Styling
└── README.md       # This file
```

## Notes

- Email must end with `@example.com` to register
- All data is stored in the browser's `localStorage` — clearing browser data will reset it
- Employees and Departments are admin-only features
- The Accounts page lists all registered users (admin only)
