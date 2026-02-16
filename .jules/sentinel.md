## 2025-05-15 - [CRITICAL] Path Traversal in Proxy Handler Bypass RBAC
**Vulnerability:** The `HandleProxy` function used `url.JoinPath` with user-controlled `name` and `namespace` parameters without validation. This allowed attackers to traverse up the URL path (e.g., `../services/myservice`) and access resources they didn't have RBAC permissions for (e.g., checking permission for `pods` but accessing `services`).
**Learning:** `url.JoinPath` resolves `..` elements. When constructing URLs for backend requests based on user input, validating that the input doesn't contain path traversal sequences is critical, especially when RBAC checks are performed on the input parameters before URL construction.
**Prevention:** Strictly validate all URL parameters used in backend requests. Ensure `name` and `namespace` do not contain `/` or `..`. Reject `path` parameters that contain `..`.

## 2026-02-16 - [CRITICAL] Insecure Randomness in API Token Generation
**Vulnerability:** Personal Access Tokens (API keys) were generated using `k8s.io/apimachinery/pkg/util/rand.String`, which relies on `math/rand` and is seeded with time. This made the tokens predictable and vulnerable to brute-force attacks if the approximate generation time was known.
**Learning:** Utilities designed for Kubernetes object naming (like `rand.String`) are not suitable for cryptographic secrets. Even if they produce random-looking strings, they lack the entropy and unpredictability required for security tokens.
**Prevention:** Always use `crypto/rand` for generating secrets, passwords, and tokens. Avoid using general-purpose random string utilities unless their documentation explicitly states they are cryptographically secure.
