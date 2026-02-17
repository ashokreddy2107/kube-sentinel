## 2024-05-23 - Avoid Eager Computation in Large Lists
**Learning:** Found an anti-pattern in `PodTable` where `podStatusCache` was eagerly computing status for all pods in the list using `useMemo`. This is O(N) where N is the total number of pods. Since `SimpleTable` handles pagination (rendering only ~20 items), we should compute derived data like pod status lazily in the render cycle (or column accessor).
**Action:** When using paginated tables, avoid eagerly computing derived data for the entire dataset. Rely on memoization at the item level (like `getPodStatus` using `WeakMap`) and let the render cycle trigger computation only for visible items (O(PageSize)).

## 2024-05-23 - Conventional Commits for PR Titles
**Learning:** The CI pipeline enforces Conventional Commits on PR titles. Emojis at the start of the title are not valid prefixes.
**Action:** Always use types like `feat`, `fix`, `perf`, etc., as prefixes for PR titles (e.g., `perf: optimize PodTable rendering performance`).

## 2024-05-23 - Retrying Submission with New Branch
**Learning:** Updating an existing PR's title via `submit` may not work if the tool reuses the PR.
**Action:** Submit to a *new branch* to force a new PR with the correct title.
