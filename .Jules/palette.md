## 2024-05-23 - [Settings Button Accessibility]
**Learning:** Icon-only buttons (like `Settings2` in `ResourceTable`) MUST have accessible names and visual tooltips for clarity.
**Action:** Always wrap icon buttons in `Tooltip` and provide `aria-label`. Use translation keys for consistency.

## 2024-05-23 - [Frontend Redirect Logic]
**Learning:** The frontend forces redirect to `/settings` if no clusters are configured for admin users, blocking access to other routes like `/pods`.
**Action:** When testing components on protected routes, either mock the cluster context or temporarily disable the redirect logic.

## 2024-05-24 - [Status Indicator Accessibility]
**Learning:** Visual-only status indicators (colored dots) are invisible to screen readers. Components like `ConnectionIndicator` must communicate state programmatically.
**Action:** Add `role="status"` and explicit `aria-label` (e.g., "Connected", "Disconnected") to status indicator elements.

## 2024-05-24 - [Conventional Commits Enforcement]
**Learning:** The repository enforces Conventional Commits (e.g., , , ) via GitHub Actions. PR titles MUST follow this format (e.g., ) and cannot be arbitrary strings like "Palette: ...".
**Action:** Always format PR titles as .

## 2024-05-24 - [Conventional Commits Enforcement]
**Learning:** The repository enforces Conventional Commits (e.g., `feat`, `fix`, `docs`) via GitHub Actions. PR titles MUST follow this format (e.g., `feat(ui): ...`) and cannot be arbitrary strings like "Palette: ...".
**Action:** Always format PR titles as `type(scope): description`.
