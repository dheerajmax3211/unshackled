# Unshackled Backend

## Prerequisites
- Java 21 (JDK)
- Maven 3.9+
- PostgreSQL (via Supabase)

## Setup
1. Copy `.env.example` to `.env` and fill in real values
2. Run: `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`

## Project Structure
```
src/main/java/com/unshackled/api/
├── ApiApplication.java          # Main entry point
├── config/                      # Configuration classes
├── controller/                  # REST API controllers
├── service/                     # Business logic
├── repository/                  # Data access (JdbcTemplate)
├── model/                       # Domain models
├── dto/                         # Request/Response DTOs
├── exception/                   # Custom exceptions + handler
├── security/                    # JWT filter, auth utilities
├── scheduler/                   # Cron jobs
└── util/                        # Utilities
```
