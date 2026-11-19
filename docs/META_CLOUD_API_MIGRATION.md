# AMS Meta Cloud API migration (work in progress)

Base: `release/1.0-rc1`. Do not deploy this branch as a sending system until all gates below pass.

## Audit findings
- `app/whatsapp/whatsapp.service.js`: Baileys QR/socket lifecycle; replace with official account connection/status.
- `app/whatsapp/sender.service.js`: Baileys `socket.sendMessage`; replace with a provider adapter, never direct freeform marketing messages.
- `app/routes/whatsapp.routes.js`: QR/connect/change endpoints; deprecate; authenticated account-status endpoint instead. Existing /qr, /status, /connect and /disconnect routes lack authentication at route level (licenseGuard is not login authentication).
- `app/services/queue.processor.js`: currently treats API acceptance as SENT; use ACCEPTED then webhook SENT/DELIVERED/READ/FAILED. Implement atomic queue claims, retry/backoff, idempotency and crash recovery.
- `app/services/campaignExecutor.js`: supports Group only; validate target selection and contact consent at queue creation AND immediately before sending.
- `app/models/queue.model.js`: add provider_message_id, provider_status, error_code, attempts, next_attempt_at, last_webhook_at; do not reuse FAILED as a retryable state.
- `app/database/schema.js`: add consent records, suppression list, template approval metadata, phone-number/WABA identifiers, webhook events, and audit logs.
- `app/server/app.js`: restrict CORS; authenticate all sensitive endpoints; webhook raw-body signature verification and HTTPS.
- Media: official API media IDs or approved HTTPS links; don't send local filesystem buffers to the Graph API.

## Security stop-ship
The release branch contains committed `auth/creds.json` and many WhatsApp session-key files. Assume compromised: unlink the linked device in WhatsApp, remove from Git history with a coordinated rewrite, rotate any other exposed credentials, and ensure `.gitignore` excludes auth, tokens, .env, and runtime DBs. Git history rewriting requires coordination with all clones. Also inspect committed `app/license/license.lic` and other runtime artifacts.

## Compliance requirements
- Explicit, provable, purpose-specific WhatsApp opt-in; import alone is not consent.
- Approved templates for business-initiated messages, matching their approved categories and parameters.
- Free-form replies only within the applicable customer-service window.
- Process STOP/opt-out immediately; suppress before queueing and sending.
- Respect per-business messaging limits, quality signals, API throttling, and applicable law.
- Meta acceptance does not guarantee delivery or protection from flags.
- Never put permanent Graph API credentials inside distributed Electron binaries.

## Deployment milestones
1. Secure compromised sessions and confirm repository cleanup.
2. Create backend service with encrypted secrets and customer-specific WABA/phone-number mapping.
3. Meta onboarding, token scopes and webhook verification.
4. Template approval/sync and consent UI; audit campaign targeting.
5. Provider abstraction, atomic queue state machine, webhook status reconciliation.
6. Test with opted-in test recipients; monitor quality, errors and costs.
7. Commercial onboarding only after Meta app permissions/review requirements are satisfied.

## Current branch scope
Preparation only. Existing Baileys transport remains active on this branch until a tested, separately reviewed cutover. No automatic campaign sending via Cloud API is enabled.
