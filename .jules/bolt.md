# Bolt's Journal

## 2026-02-26 - CI Failure due to PR Title
**Learning:** The repository uses Conventional Commits for PR titles, enforced by GitHub Actions. A PR title like "⚡ Bolt: Implement route-based code splitting" fails the check because it lacks a standard type prefix (e.g., `feat`, `fix`, `perf`).
**Action:** Always format PR titles with Conventional Commits (e.g., `perf(ui): implement route-based code splitting`) to ensure CI passes.
