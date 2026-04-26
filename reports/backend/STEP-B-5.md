# STEP B-5: User Domain — Verification Report

**Status:** ✅ COMPLETE  
**Date:** 2026-04-25  
**Tasks:** 7/7 completed  
**Depends on:** STEP B-1 ✅, B-2 ✅, B-3 ✅, B-4 ✅

---

## What Was Built

| Task | File | Description |
|---|---|---|
| B-5.1 | `model/UserModel.java` | Java record mapping exactly to the `public.users` Postgres table. Uses `java.util.UUID` for the `id` field. |
| B-5.2 | `dto/CreateUserRequest.java` | DTO for POST `/api/users`. Includes Bean Validation annotations (`@NotBlank`, `@Size`, `@Pattern` for username). |
| B-5.3 | `dto/UpdateUserRequest.java` | DTO for PATCH `/api/users/me`. All fields are optional. Used to dynamically build the SQL update query. |
| B-5.4 | `dto/UserResponse.java` | Response DTO that strips out sensitive backend-only fields (like `stripeCustomerId`, `pushSubscription`) before returning to the frontend. |
| B-5.5 | `repository/UserRepository.java` | `JdbcTemplate`-based DAO. Implements `RowMapper` for clean mapping. Contains dynamic SQL builder in `update()` to only update non-null fields provided in `UpdateUserRequest`. |
| B-5.6 | `service/UserService.java` | Business logic for creating, fetching, updating, and deleting profiles. Enforces ownership authorization (can only update/delete own profile) and username uniqueness. |
| B-5.7 | `controller/UserController.java` | Exposes REST endpoints: POST `/`, GET `/me`, PATCH `/me`, DELETE `/me`, GET `/{username}`. Injects `AuthenticatedUser` to automatically extract the caller's UUID from their JWT. |

## Design Decisions

- **Dynamic Updates:** The `UserRepository.update()` method dynamically constructs the SQL `UPDATE` statement based on which fields in the `UpdateUserRequest` are not null. This allows the frontend to send partial updates (e.g., just updating the `avatarUrl`) without needing to send the entire user object back.
- **UUIDs vs Strings:** Used `java.util.UUID` for primary keys instead of `String`. Supabase's `auth.users(id)` and the `public.users(id)` columns are both native Postgres `UUID` types. Using Java's UUID class avoids tedious casting issues in `JdbcTemplate` queries.
- **Strict Validation on Creation:** The `CreateUserRequest` strictly validates the username (letters, numbers, underscores only) to prevent routing issues on the frontend since usernames are used in URLs (e.g., `/{username}`).

## Verification

| Check | Result |
|---|---|
| `mvnw compile` succeeds | ✅ Pass |
| `UserModel` fields match architecture DB schema | ✅ Pass |
| `UserRepository` maps `java.util.UUID` correctly | ✅ Pass |
| `UserService` enforces ownership on updates/deletes | ✅ Pass |
| `UserController` requires valid JWT for all routes | ✅ Pass |
| `UserResponse` correctly filters sensitive data | ✅ Pass |

## Connection to Next Step

**STEP B-6 (Habit Domain)** is next. It will depend on:
- User existence (verified by the tools built here) to assign `user_habits`.
- `JdbcTemplate` for Habit queries.

**Ready for STEP B-6.**
