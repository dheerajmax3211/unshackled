### `mvp-v1.1-unstable` [CURRENT]
- **Purpose**: Enhanced combined branch featuring dynamic color themes (Amber, Ocean, Forest, Midnight) and the floating theme switcher.
- **Key Features**:
  - Full Spring Boot backend.
  - Multi-theme support in the Next.js 14 frontend.
  - Integration testing with theme-aware components.

### `frontend-unstable-v1.1`
- **Purpose**: A dedicated frontend branch containing the latest UI features, including the theme engine and switcher.
- **Key Features**:
  - ThemeProvider and ThemeSwitcher implementations.
  - Updated design tokens for multiple palettes.
  - Component showcase with real-time theme toggling.
- **Note**: Focused exclusively on UI/UX development and theme refinements.

### `backend-stable-v1`
- **Purpose**: A clean, stable environment containing only the backend logic, database schemas, and technical documentation. Use this as the source of truth for the API and server-side features.

---

## Which branch should I use?
- If you need to **test the UI with themes and backend**, use `mvp-v1.1-unstable`.
- If you are **developing UI/UX with themes** in isolation, use `frontend-unstable-v1.1`.
- If you are **modifying backend logic**, use `backend-stable-v1`.
- If you need to **reference the old UI**, switch to `feature/initial-architecture-audit`.
