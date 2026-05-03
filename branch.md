### `mvp-v2-stable` [CURRENT]
- **Purpose**: Fully stabilized, high-fidelity visual and motion overhaul. Production-ready frontend UI.
- **Key Features**:
  - Abstract "Void" 3D scene with 10,000 performance-optimized particles and geometric sigils.
  - Complete motion system (magnetic tilt, cursor-reactive specular highlights, smooth scroll).
  - Premium Cyberpunk/Recovery aesthetic with 5 distinct themes and polished micro-animations (Habit tracker, calendar, badges).
- **Note**: The definitive visual baseline for the frontend platform.

### `mvp-v1.2-unstable`
- **Purpose**: High-fidelity visual update with habit-themed 3D backgrounds and multi-theme support.
- **Key Features**:
  - Dynamic 3D UI background (Cigarettes, Beer, Pills, Cannabis, Silhouettes, Broken Screens).
  - Dynamic color theme switcher (Amber, Ocean, Forest, Midnight).
  - Combined stable backend and frontend.
- **Note**: **Dynamic UI background but definitely not even close to production level**. This branch is for visual review and integration testing of the new theme engine.

### `mvp-v1.1-unstable`
- **Purpose**: Enhanced combined branch featuring dynamic color themes and the floating theme switcher.

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
- If you want the **latest stable production-ready UI**, use `mvp-v2-stable`.
- If you want the **experimental 3D model testing**, use `mvp-v1.2-unstable`.
- If you need to **test the UI with themes and backend**, use `mvp-v1.1-unstable`.
- If you are **developing UI/UX with themes** in isolation, use `frontend-unstable-v1.1`.
- If you are **modifying backend logic**, use `backend-stable-v1`.
- If you need to **reference the old UI**, switch to `feature/initial-architecture-audit`.
