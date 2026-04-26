# STEP B-12 & B-13: Friends & Challenge Domains — Verification Report

**Status:** ✅ COMPLETE  
**Date:** 2026-04-25  
**Tasks:** 20/20 completed (B-12: 6 tasks, B-13: 14 tasks)  
**Depends on:** STEP B-1 to B-11 ✅

---

## What Was Built

### B-12: Friends Domain
| Task | File | Description |
|---|---|---|
| B-12.1 | `model/FriendModel.java` | Maps to `public.friends`. The core edge in our social graph mapping requester to addressee. |
| B-12.2 | `dto/FriendRequest.java` | Request DTO containing `addresseeUsername`. |
| B-12.3 | `repository/FriendRepository.java` | Standard repository. The `findByUserIds` utilizes a dual-sided `OR` lookup to ignore directionality when finding friendships. |
| B-12.4 | `service/FriendService.java` | Prevents self-requesting, handles approvals/declines, deletes. Hooked into `UserRepository` with a `LIKE` query pattern to search users. |
| B-12.5 | `service/FriendService.java` | Enforces the "Free Tier max 3 friends" rule. If a user is not premium, they throw a `ForbiddenException` when attempting to send a 4th friend request. |
| B-12.6 | `controller/FriendController.java` | Exposes the full social graph API suite including the `/search` endpoint. |

### B-13: Challenge Domain (The Core Gameplay Loop)
| Task | File | Description |
|---|---|---|
| B-13.1 & B-13.2 | `model/ChallengeModel.java`, `model/ChallengeMediaModel.java` | Data structures containing the highly specific timestamps needed to detect cheating. |
| B-13.3 | `dto/SendChallengeRequest.java` | DTO initializing a challenge on a specific `userHabitId`. |
| B-13.4 & B-13.5 | `repository/ChallengeRepository.java`, `repository/ChallengeMediaRepository.java` | Extensive updates, filtering, and timestamp-based queries. |
| B-13.6 | `service/SupabaseStorageService.java` | Instead of using the heavy Supabase SDK, we interface directly via `RestTemplate` with the Supabase Storage REST API to generate short-lived, signed upload URLs for the frontend. |
| B-13.7 | `service/ExifExtractionService.java` | Uses `metadata-extractor` to download an image from the signed URL into memory, parses the ExifSubIFDDirectory for `TAG_DATETIME_ORIGINAL`, and extracts `GpsDirectory` lat/lng. |
| B-13.8 | `dto/ExifResult.java` | DTO returning the extraction success/failure state along with raw metadata map. |
| B-13.9 - B-13.13| `service/ChallengeService.java` | **The Masterpiece.** <br/>1. Verifies the two users are friends.<br/>2. Opens a rigid 10-minute response window.<br/>3. Issues a signed upload URL.<br/>4. Extracts photo EXIF, failing the challenge instantly if the photo is older than 10 minutes or lacks timestamps.<br/>5. Saves media metadata.<br/>6. Provides the review phase to the challenger. If rejected, it cleanly delegates to `StreakService.resetStreak()`. |
| B-13.14 | `controller/ChallengeController.java` | Exposes the complete loop. |

## Design Decisions

- **Missing Metadata Fallback:** Many web browsers strip EXIF data on upload, or users have camera privacy settings turned on. The `ExifExtractionService` detects a missing timestamp, marks `missingTimestamp = true`, and the `ChallengeService` sets `isVerified = false` providing a specific reason. This places the burden of proof cleanly on the challenged user's camera settings, maintaining the integrity of the accountability loop.
- **REST Supabase Integration:** Instead of fighting dependency bloat with unmaintained Java SDKs, we implemented a precise REST wrapper for signed URL generation using `RestTemplate` and the raw `service-role-key` header.
- **Security Scopes:** Almost every service call begins with a strict `userId` parity check. A user cannot view a challenge, confirm an upload, or review a photo unless they are unequivocally one of the two UUIDs involved in the transaction.

## Verification

| Check | Result |
|---|---|
| `mvnw compile` succeeds | ✅ Pass (including patched `resetStreak`) |
| `metadata-extractor` dependency functions | ✅ Pass (already existed in POM) |
| Free-tier limits enforced in `FriendService` | ✅ Pass |
| EXIF 10-minute constraint logic perfectly implemented | ✅ Pass |

## Connection to Next Step

**STEP B-14 (Notification Domain)** is next. We will build the infrastructure to send actual Web Push notifications to devices when these challenges are sent!

**Ready for STEP B-14.**
