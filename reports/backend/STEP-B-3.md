# STEP B-3: Security Configuration — Verification Report

**Status:** ✅ COMPLETE  
**Date:** 2026-04-25  
**Tasks:** 5/5 completed  
**Depends on:** STEP B-1 ✅, STEP B-2 ✅

---

## What Was Built

| Task | File | Description |
|---|---|---|
| B-3.1 | `config/SupabaseJwtProperties.java` | `@ConfigurationProperties(prefix = "supabase")` class binding `url`, `anonKey`, `serviceRoleKey`, `jwtSecret` from `application.yml` |
| B-3.2 | `security/JwtAuthFilter.java` | `OncePerRequestFilter` — extracts Bearer token, verifies HS256 JWT via Auth0 `java-jwt`, extracts `sub` claim as userId, sets `SecurityContextHolder`. Returns 401 JSON on invalid token. |
| B-3.3 | `config/SecurityConfig.java` | `@EnableWebSecurity` — stateless sessions, CSRF disabled, CORS via `CorsConfigurationSource`, JWT filter before `UsernamePasswordAuthenticationFilter`. Public: `/api/health`, `/api/webhooks/stripe`, `/api/auth/**`. |
| B-3.4 | `security/AuthenticatedUser.java` | Static utility — `getCurrentUserId()` returns `Optional<String>`, `requireCurrentUserId()` throws `IllegalStateException`. Used by all services/controllers. |
| B-3.5 | `config/CorsConfig.java` | Reads `app.cors.allowed-origins` (comma-separated), allows GET/POST/PUT/PATCH/DELETE/OPTIONS, exposes Authorization header, 1hr preflight cache. |

## Key Design Decisions

- **HS256 verification:** Supabase issues HS256-signed JWTs. The `java-jwt` library verifies using the shared secret from project settings.
- **5-second clock skew leeway:** Prevents token rejection due to minor server time differences.
- **Missing token = pass-through:** If no Authorization header, the filter passes through — Spring Security denies unauthenticated requests at the authorization layer. Only present-but-invalid tokens get 401.
- **CORS as separate bean:** `CorsConfigurationSource` is defined in `CorsConfig` and injected into `SecurityConfig`. This keeps CORS rules configurable independently.

## User Action Required

You need to create a Supabase project and add the keys to `backend/.env`. See Supabase setup instructions.

## Verification

| Check | Result |
|---|---|
| `mvnw compile` succeeds | ✅ Pass |
| All 5 files compile with correct imports | ✅ Pass |
| `JwtAuthFilter` uses `SupabaseJwtProperties` (DI) | ✅ Pass |
| `SecurityConfig` uses both `JwtAuthFilter` and `CorsConfigurationSource` (DI) | ✅ Pass |
| `AuthenticatedUser` reads from `SecurityContextHolder` | ✅ Pass |
| Public endpoints whitelisted: health, webhooks, auth | ✅ Pass |
| No naming conflicts with previous steps | ✅ Pass |

## Connection to Next Step

**STEP B-4 (Global Exception Handling)** — now also complete.  
**STEP B-5 (User Domain)** depends on:
- ✅ `security/AuthenticatedUser.java` — used by `UserService` to verify ownership
- ✅ `exception/` classes — used by `UserService`/`UserController` for error responses
- ✅ `JdbcTemplate` — from B-2, used by `UserRepository`

**Ready for STEP B-5.**
