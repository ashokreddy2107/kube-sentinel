## 2025-05-15 - [CRITICAL] Path Traversal in Proxy Handler Bypass RBAC
**Vulnerability:** The `HandleProxy` function used `url.JoinPath` with user-controlled `name` and `namespace` parameters without validation. This allowed attackers to traverse up the URL path (e.g., `../services/myservice`) and access resources they didn't have RBAC permissions for (e.g., checking permission for `pods` but accessing `services`).
**Learning:** `url.JoinPath` resolves `..` elements. When constructing URLs for backend requests based on user input, validating that the input doesn't contain path traversal sequences is critical, especially when RBAC checks are performed on the input parameters before URL construction.
**Prevention:** Strictly validate all URL parameters used in backend requests. Ensure `name` and `namespace` do not contain `/` or `..`. Reject `path` parameters that contain `..`.

## 2025-05-23 - [CRITICAL] Insecure File Permissions for Credentials
**Vulnerability:** The functions `GetUserGlabConfigDir` and `WriteUserAWSCredentials` created directories and files with `0777` and `0666` permissions respectively. This allowed any user or process on the host/container to read sensitive AWS credentials and GitLab tokens stored in `/data`.
**Learning:** `os.MkdirAll` and `os.WriteFile` with overly permissive modes (like `0777` or `0666`) expose sensitive data to all users on the system. Even inside a container, this is bad practice as it facilitates privilege escalation if the container is compromised or shares volumes.
**Prevention:** Always use `0700` (rwx------) for directories containing sensitive data and `0600` (rw-------) for sensitive files. Explicitly `Chmod` after creation if the creation function (like `MkdirAll` subject to umask) doesn't guarantee exact permissions.
