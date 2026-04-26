# STEP B-4: Global Exception Handling — Verification Report

**Status:** ✅ COMPLETE  
**Date:** 2026-04-25  
**Tasks:** 4/4 completed  
**Depends on:** STEP B-1 ✅, STEP B-2 ✅, STEP B-3 ✅

---

## What Was Built

| Task | File | Description |
|---|---|---|
| B-4.1 | `dto/ApiError.java` | Java record: `status`, `error`, `message`, `timestamp`, optional `fieldErrors`. Two convenience constructors (simple + with field errors). `@JsonInclude(NON_NULL)` hides null `fieldErrors`. |
| B-4.2 | `exception/GlobalExceptionHandler.java` | `@RestControllerAdvice` handling 6 exception types → HTTP status codes. Logs at appropriate levels (warn for client errors, error for 500s). |
| B-4.3 | `exception/ResourceNotFoundException.java` | 404 — two constructors: simple message + entity-field-value pattern (`"User not found with id: abc"`). |
| B-4.4 | `exception/UnauthorizedException.java` | 401 — default message constructor + custom message constructor. |

## Bonus Files (Needed by B-4.2)

| File | Description |
|---|---|
| `exception/ValidationException.java` | 400 — for business logic validation failures (distinct from Bean Validation) |
| `exception/ForbiddenException.java` | 403 — for premium gating and authorization failures (needed by future steps) |

## Exception → HTTP Status Mapping

| Exception | Status | When Used |
|---|---|---|
| `ResourceNotFoundException` | 404 | User/habit/challenge not found |
| `UnauthorizedException` | 401 | Missing or invalid JWT |
| `ForbiddenException` | 403 | Premium feature on free plan |
| `ValidationException` | 400 | Business rule violation |
| `MethodArgumentNotValidException` | 400 | `@Valid` Bean Validation failure (with field errors) |
| `IllegalArgumentException` | 400 | Bad input parameters |
| `Exception` (catch-all) | 500 | Unexpected server errors |

## Verification

| Check | Result |
|---|---|
| `mvnw compile` succeeds | ✅ Pass |
| All 6 files compile with correct imports | ✅ Pass |
| `GlobalExceptionHandler` references all exception classes | ✅ Pass |
| `ApiError` record serializes correctly with Jackson | ✅ Pass |
| Field error list is `@JsonInclude(NON_NULL)` | ✅ Pass |
| Catch-all handler hides internal details from client | ✅ Pass |
| No naming conflicts with previous steps | ✅ Pass |

## Connection to Next Step

**STEP B-5 (User Domain)** depends on:
- ✅ `ResourceNotFoundException` — thrown when user not found
- ✅ `UnauthorizedException` — thrown when not authenticated
- ✅ `ValidationException` — thrown on invalid user data
- ✅ `ApiError` — response format for all errors
- ✅ `AuthenticatedUser` — from B-3, used to get current user
- ✅ `JdbcTemplate` — from B-2, used by `UserRepository`

**Ready for STEP B-5.**
