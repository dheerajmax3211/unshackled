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

### `feature/initial-architecture-audit`
- **Purpose**: The main development branch where the initial full-stack implementation (including the original Next.js UI) was built and audited.
- **Key Features**:
  - Full-stack architecture (Backend + Next.js UI).
  - Original UI components and styles.
  - Audit logs and migration scripts.

---

## Which branch should I use?
- If you are **rewriting the UI**, start from `backend-stable-v1` to ensure you have a clean slate with a fully functional backend.
- If you need to **reference the old UI**, switch to `feature/initial-architecture-audit`.
