# Project Branch Guide

This document explains the purpose and content of the various branches in the QuitApp repository.

## Branches

### `backend-stable-v1` [CURRENT]
- **Purpose**: A clean, stable environment containing only the backend logic, database schemas, and technical documentation. Use this as the source of truth for the API and server-side features.
- **Key Features**:
  - Full Spring Boot backend implementation.
  - Supabase database schema (`supabase_schema.sql`).
  - API documentation and use cases (`Confluence/`, `FinalArchitecture.md`).
  - Postman collections (`postman/`).
  - Backend performance and logic reports (`reports/`).
  - AI prompt templates (`prompt.md`).
  - Environment configuration (`backend/.env`).
- **Note**: This branch contains **no frontend code**. It is intended for backend stability and as a reference for UI rewrites.

### `frontend-stable-v1`
- **Purpose**: A dedicated branch for the frontend UI rewrite, containing the modern Next.js 14 component showcase and design system.
- **Key Features**:
  - Full component showcase (Landing, App, Shared, UI).
  - Mock data for visual review.
  - UI enhancement prompts and design notes.
- **Note**: This branch is derived from `backend-stable-v1` but focuses exclusively on UI/UX development.

---

## Which branch should I use?
- If you are **developing or reviewing UI/UX**, use `frontend-stable-v1`.
- If you are **modifying backend logic**, use `backend-stable-v1`.
- If you need to **reference the old UI**, switch to `feature/initial-architecture-audit`.
