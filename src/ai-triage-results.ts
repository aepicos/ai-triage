// ai-triage-results.ts
// Pre-computed AI triage ignore decisions applied when a retest completes.
// ~60 % of issues are marked "Not vulnerable" based on deployment context.

export interface AiTriageIgnore {
  issueId: string
  reason: string
  confidence: 'High' | 'Medium' | 'Low'
}

export const aiTriageIgnores: AiTriageIgnore[] = [

  // ── High severity (10) ────────────────────────────────────────────────────
  {
    issueId: 'h-06',
    reason: 'B2B order endpoint is only reachable via authenticated internal API. Expression evaluation runs in a sandboxed Node.js VM with no filesystem or network access in this environment.',
    confidence: 'Medium',
  },
  {
    issueId: 'h-13',
    reason: 'Webhook callbacks are restricted to pre-approved localhost endpoints. The deployment environment has no outbound internet access, making external SSRF exploitation impossible.',
    confidence: 'High',
  },
  {
    issueId: 'h-17',
    reason: 'Chatbot URL resolution is constrained to the local knowledge-base server. Application runs in an isolated network segment with no outbound HTTP connectivity.',
    confidence: 'High',
  },
  {
    issueId: 'h-19',
    reason: 'Tool is only used on the command line and outside the threat model for this application. No user-supplied input reaches this prototype-merging code path at runtime.',
    confidence: 'Medium',
  },
  {
    issueId: 'h-20',
    reason: 'Same B2B internal-API context as the related finding in this file. Sandboxed VM execution confirmed; no escalation path to host OS or network identified.',
    confidence: 'Medium',
  },
  {
    issueId: 'h-29',
    reason: 'Profile image upload serves files from a local filesystem only. The environment has no outbound HTTP client capability, so remote URL fetching cannot be triggered.',
    confidence: 'Medium',
  },
  {
    issueId: 'h-30',
    reason: 'Chatbot static assets are served from a read-only sandboxed directory. The deployment mounts this path with noexec,ro flags; no directory escape or code execution is possible.',
    confidence: 'High',
  },
  {
    issueId: 'h-33',
    reason: 'This route implements the intentional code-challenge feature of the security-training application. Execution is sandboxed and the behaviour is expected by design.',
    confidence: 'High',
  },
  {
    issueId: 'h-34',
    reason: 'Key server runs in an air-gapped test environment. Path traversal has no impact as all files in the directory are intended to be served and contain no sensitive material.',
    confidence: 'High',
  },
  {
    issueId: 'h-35',
    reason: 'JWT test uses algorithm: none intentionally to validate fallback behaviour. This route is exercised exclusively by automated integration tests; no real user credentials or TOTP secrets are used.',
    confidence: 'High',
  },

  // ── Medium severity (25) ──────────────────────────────────────────────────
  {
    issueId: 'm-03',
    reason: 'Redirect targets are validated against an allowlist enforced at the reverse-proxy layer. No arbitrary user-supplied URLs are accepted without prior sanitisation in CI runs.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-06',
    reason: 'Coupon codes are generated deterministically and validated server-side before any discount is applied. Client input is never trusted in this flow.',
    confidence: 'High',
  },
  {
    issueId: 'm-08',
    reason: 'Chatbot responses are rendered inside a sandboxed iframe with a strict CSP sandbox attribute. Script execution from chatbot output is blocked by the browser in all supported environments.',
    confidence: 'High',
  },
  {
    issueId: 'm-11',
    reason: 'URL upload is accessible only to authenticated users. The redirect target is fixed to the authenticated user\'s own profile page; no open-redirect path exists for unauthenticated callers.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-13',
    reason: 'Angular expression evaluation route is a deliberate challenge feature of the training application. Angular\'s built-in sanitizer remains active for all other template contexts in production.',
    confidence: 'High',
  },
  {
    issueId: 'm-17',
    reason: 'Login events are captured by the infrastructure-level WAF and forwarded to the SIEM. Application-level logging is supplementary; the absence of a specific log line does not create a gap in the audit trail.',
    confidence: 'Low',
  },
  {
    issueId: 'm-18',
    reason: 'MD5 usage is isolated to a legacy compatibility layer for existing data migration. New records use bcrypt. This code path is not reachable from any authenticated session in production.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-21',
    reason: 'Detailed stack traces are gated behind the NODE_ENV=development flag. The error handler returns a generic message in staging and production; verbose output is never surfaced to end users.',
    confidence: 'High',
  },
  {
    issueId: 'm-22',
    reason: 'Webhook payload logging is disabled via a feature flag in all environments outside local development. Log output is not forwarded to any external system.',
    confidence: 'High',
  },
  {
    issueId: 'm-23',
    reason: 'Application configuration is loaded from a static, read-only config file at startup. No user-controlled input reaches this merge operation during request handling.',
    confidence: 'High',
  },
  {
    issueId: 'm-24',
    reason: 'Integration test targeting local dev server. Redirect allowlist is enforced at the reverse-proxy layer; no open-redirect path is reachable from outside the test subnet.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-25',
    reason: 'Continue-code encodes game-progress state only. The deserialized object is validated against a strict schema before use; no code-execution path exists within the deserialization logic.',
    confidence: 'High',
  },
  {
    issueId: 'm-28',
    reason: 'Hash function is used only for non-security purposes (cache busting, ETag generation). No authentication or integrity decisions depend on this value.',
    confidence: 'High',
  },
  {
    issueId: 'm-29',
    reason: 'Rate limiting is enforced at the API-gateway layer (nginx + fail2ban). Application-level limiting is not required per the agreed defence-in-depth architecture for this deployment.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-32',
    reason: 'B2B order operations are logged at the infrastructure layer via request-middleware audit trails. Application-level logging is not required for internal API calls in this architecture.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-33',
    reason: 'Key-verification endpoint is only reachable from the admin subnet (172.16.0.0/12). Responses contain hashed key material only; no plaintext secrets are exposed.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-35',
    reason: 'TOTP implementation uses HMAC-SHA1 as mandated by RFC 6238. This is the required algorithm for TOTP compatibility and is not a weakness in this specific context.',
    confidence: 'High',
  },
  {
    issueId: 'm-36',
    reason: 'Easter-egg route is an intentional challenge feature of the security-training application. No real users are directed here outside the game context.',
    confidence: 'High',
  },
  {
    issueId: 'm-37',
    reason: 'File upload route enforces a strict MIME-type allowlist before any deserialization occurs. Only image files pass validation; archive and executable types are rejected at the gateway.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-40',
    reason: 'File-upload events are captured by the storage-layer audit trail (S3 server-access logs). Application-level logging for this route is not required in the current architecture.',
    confidence: 'Low',
  },
  {
    issueId: 'm-41',
    reason: 'Configuration object is sealed via Object.freeze after initial load. Prototype-pollution attempts on a frozen object are silently ignored by the JavaScript engine.',
    confidence: 'High',
  },
  {
    issueId: 'm-42',
    reason: 'Utility is used only for generating non-security-sensitive display identifiers (avatar colour hashes). No integrity or authentication decisions depend on this value.',
    confidence: 'High',
  },
  {
    issueId: 'm-47',
    reason: 'Language strings are loaded from a static locale file. User input cannot influence which locale is loaded; the route accepts only pre-defined ISO language codes.',
    confidence: 'High',
  },
  {
    issueId: 'm-48',
    reason: 'Chatbot configuration validation runs at startup only, before any request handling. Validated config values are not persisted or transmitted to clients.',
    confidence: 'Medium',
  },
  {
    issueId: 'm-49',
    reason: 'Angular compatibility shim is executed only during server-side rendering of the admin dashboard. Input is sanitized by the Angular DI layer before reaching this merge operation.',
    confidence: 'Low',
  },

  // ── Low severity — all (37, excluding l-37 which is already ignored) ──────
  {
    issueId: 'l-01',
    reason: 'Information Disclosure: error-handler output is gated behind NODE_ENV=development. Generic responses are returned in all non-local environments.',
    confidence: 'High',
  },
  {
    issueId: 'l-02',
    reason: 'Missing Security Header: X-Frame-Options and related headers are injected by the nginx reverse proxy. Application-layer header management is not required in this deployment architecture.',
    confidence: 'High',
  },
  {
    issueId: 'l-03',
    reason: 'Debug Code in Production: log output is controlled by the LOG_LEVEL environment variable, which is set to warn in staging and production. Debug statements are suppressed outside local development.',
    confidence: 'High',
  },
  {
    issueId: 'l-04',
    reason: 'Improper Error Handling: raw error details are intercepted and redacted by the global error-handler middleware before any response is sent to the client.',
    confidence: 'High',
  },
  {
    issueId: 'l-05',
    reason: 'Information Disclosure: application version endpoint is only accessible from the internal monitoring subnet. No version information is surfaced to unauthenticated external users.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-06',
    reason: 'Debug Code in Production: LOG_LEVEL=warn in all non-local environments suppresses this output. No debug information reaches production log streams.',
    confidence: 'High',
  },
  {
    issueId: 'l-07',
    reason: 'Improper Error Handling: global middleware redacts stack traces before response serialization. Client receives only a sanitized error code and message.',
    confidence: 'High',
  },
  {
    issueId: 'l-08',
    reason: 'Missing Security Header: HSTS and CSP headers are set at the nginx layer for all responses. Duplicate application-layer headers are not required.',
    confidence: 'High',
  },
  {
    issueId: 'l-09',
    reason: 'Information Disclosure: search route returns query-scoped results only. No internal path or stack information is included in the response payload.',
    confidence: 'High',
  },
  {
    issueId: 'l-10',
    reason: 'Debug Code in Production: challenge utility debug logging is gated behind LOG_LEVEL. Confirmed suppressed in staging and production via environment configuration.',
    confidence: 'High',
  },
  {
    issueId: 'l-11',
    reason: 'Improper Error Handling: error is caught and forwarded to the global handler, which sanitizes and returns a generic 500 response. No raw exception detail is leaked.',
    confidence: 'High',
  },
  {
    issueId: 'l-12',
    reason: 'Missing Security Header: Referrer-Policy and Permissions-Policy are injected by the reverse proxy configuration. Not the responsibility of the application layer in this architecture.',
    confidence: 'High',
  },
  {
    issueId: 'l-13',
    reason: 'Information Disclosure: version route is behind IP allowlist on the load balancer. Confirmed inaccessible from external networks in the current firewall ruleset.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-14',
    reason: 'Debug Code in Production: chatbot debug logging controlled by LOG_LEVEL. No debug output reaches production or staging log aggregators.',
    confidence: 'High',
  },
  {
    issueId: 'l-15',
    reason: 'Improper Error Handling: file-upload errors are caught by the multer error middleware, which returns a structured JSON error with no internal path or stack disclosure.',
    confidence: 'High',
  },
  {
    issueId: 'l-16',
    reason: 'Missing Security Header: delivery route responses inherit all security headers from the nginx upstream configuration. No additional application-level headers are required.',
    confidence: 'High',
  },
  {
    issueId: 'l-17',
    reason: 'Information Disclosure: forgot-password route returns a generic response regardless of whether the email exists. No account-enumeration information is disclosed.',
    confidence: 'High',
  },
  {
    issueId: 'l-18',
    reason: 'Debug Code in Production: feedback debug logging is gated by LOG_LEVEL environment variable. Confirmed off in staging and production deployments.',
    confidence: 'High',
  },
  {
    issueId: 'l-19',
    reason: 'Improper Error Handling: B2B route errors are caught and a generic 400 or 500 is returned. No internal detail is leaked in the error response body.',
    confidence: 'High',
  },
  {
    issueId: 'l-20',
    reason: 'Information Disclosure: data-export route is authenticated and scoped to the requesting user\'s own data. No cross-user data or system paths are included in the export.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-21',
    reason: 'Missing Security Header: X-Content-Type-Options and related headers are set globally by the nginx server block. Confirmed present in all responses via integration-test header checks.',
    confidence: 'High',
  },
  {
    issueId: 'l-22',
    reason: 'Improper Error Handling: login errors are normalized to a single message ("Invalid credentials") by the authentication middleware. No differential error disclosure is possible.',
    confidence: 'High',
  },
  {
    issueId: 'l-23',
    reason: 'Debug Code in Production: insecurity library debug output is controlled by LOG_LEVEL. No debug information is written to production log streams.',
    confidence: 'High',
  },
  {
    issueId: 'l-24',
    reason: 'Information Disclosure: search results are filtered by the query scope. Internal table names or SQL structure are not included in any API response.',
    confidence: 'High',
  },
  {
    issueId: 'l-25',
    reason: 'Missing Input Validation: basket-item quantity is validated at the database constraint level (positive integer check). Invalid values are rejected before the UPDATE executes.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-26',
    reason: 'Missing Input Validation: integration test targeting local dev server. No TLS expected in this context. Feedback content is sanitized by the presentation layer before rendering.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-27',
    reason: 'Debug Code in Production: review-collection debug logging gated by LOG_LEVEL. No debug output reachable outside local development environment.',
    confidence: 'High',
  },
  {
    issueId: 'l-28',
    reason: 'Improper Error Handling: multer error middleware intercepts file-upload failures and returns a sanitized error response. No internal path or exception detail is exposed.',
    confidence: 'High',
  },
  {
    issueId: 'l-29',
    reason: 'Information Disclosure: profile image URL is validated against an allowlist before being stored or returned. No internal filesystem paths or credentials are included in the response.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-30',
    reason: 'Missing Input Validation: profile image URL update is preceded by URL validation middleware. Malformed or disallowed URLs are rejected before the UPDATE executes.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-31',
    reason: 'Debug Code in Production: authenticated-users route debug logging is gated by LOG_LEVEL environment variable. Confirmed suppressed in all non-local environments.',
    confidence: 'High',
  },
  {
    issueId: 'l-32',
    reason: 'Missing Input Validation: delivery method ID is validated as a UUID format by the router middleware before reaching the database query. Invalid formats are rejected with a 400.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-33',
    reason: 'Improper Error Handling: chatbot errors are caught and a user-friendly fallback message is returned. No stack trace or internal detail reaches the client.',
    confidence: 'High',
  },
  {
    issueId: 'l-34',
    reason: 'Information Disclosure: app-version route is behind an IP allowlist. Confirmed not reachable from external networks; version string does not expose internal infrastructure details.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-35',
    reason: 'Missing Input Validation: 2FA token is validated for numeric format and length by the TOTP library before any database lookup occurs. Malformed tokens are rejected early.',
    confidence: 'Medium',
  },
  {
    issueId: 'l-36',
    reason: 'Debug Code in Production: insecurity library LOG_LEVEL gating confirmed. No debug output forwarded to external log aggregators in staging or production.',
    confidence: 'High',
  },
  {
    issueId: 'l-38',
    reason: 'Debug Code in Production: log output is controlled by the LOG_LEVEL environment variable. Confirmed suppressed in all non-local deployment environments.',
    confidence: 'High',
  },
]
