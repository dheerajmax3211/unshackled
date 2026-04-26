# STEP B-6: Habit Domain — Verification Report

**Status:** ✅ COMPLETE  
**Date:** 2026-04-25  
**Tasks:** 7/7 completed  
**Depends on:** STEP B-1 to B-5 ✅

---

## What Was Built

| Task | File | Description |
|---|---|---|
| B-6.1 | `model/HabitModel.java` | Java record mapping to the static `public.habits` predefined seed table. |
| B-6.2 | `model/UserHabitModel.java` | Java record mapping to `public.user_habits`. Contains all columns tracking a user's progress and custom configurations. |
| B-6.3 | `dto/AddHabitRequest.java` | DTO used for adding/updating a habit, holding configuration details like `costPerCigarette` and `drinksPerWeek`. |
| B-6.4 | `repository/HabitRepository.java` | `JdbcTemplate`-based DAO to fetch the read-only catalog of habits available. |
| B-6.5 | `repository/UserHabitRepository.java` | DAO for user habits. Handles dynamic configuration updates and inserts into complex columns, including Postgres Arrays (for platforms). |
| B-6.6 | `service/HabitService.java` | Contains validation (ensures users don't track the same habit actively twice), coordinates adding a habit, and executes a raw SQL statement to seed an initial `streaks` row in the DB with a current streak of 0 as demanded by the architecture. |
| B-6.7 | `controller/HabitController.java` | Exposes REST endpoints: GET `/api/habits` (global list), POST `/api/habits/mine`, GET `/api/habits/mine`, PUT `/api/habits/mine/{id}`, DELETE `/api/habits/mine/{id}`. |

## Design Decisions

- **Dynamic Updates on Complex Tables:** `UserHabitRepository.update()` dynamically pieces together SQL strings so that when an update request hits `PUT /mine/{userHabitId}`, only provided parameters will be overwritten in Postgres, preserving other non-relevant fields.
- **Initial Streak Injection:** As dictated in B-6.6, inserting a user habit also natively executes an `INSERT INTO streaks` row for that specific `user_habit_id` to start their counters at 0 immediately. This saves the onboarding flow from having to perform extra API calls.
- **Handling Arrays:** The backend uses standard JDBC `java.sql.Array` methods to translate the `String[] platforms` into a Postgres string array (`TEXT[]`) smoothly. 

## Verification

| Check | Result |
|---|---|
| `mvnw compile` succeeds | ✅ Pass |
| `HabitModel` and `UserHabitModel` fields match architecture DB schema | ✅ Pass |
| `HabitService` enforces ownership and unique active habits | ✅ Pass |
| `UserHabitRepository` handles Postgres Array mappings properly | ✅ Pass |
| `HabitController` endpoints strictly require JWT authentication | ✅ Pass |
| Raw streak insert handles foreign keys perfectly via `RETURNING id` | ✅ Pass |

## Connection to Next Step

**STEP B-7 (Onboarding Domain)** is next. It will tie B-5 (User profile completion) together with B-6 (Tracking habits) into a single transactional onboarding flow. 

**Ready for STEP B-7.**
