# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

KryptoStream is a **deliberately vulnerable** Node.js application used for demonstrating JFrog security scanning (Frogbot, Xray) and vulnerability remediation workflows. The app contains intentional CVEs — do not "fix" security vulnerabilities unless explicitly asked.

## Common Commands

```bash
# Install dependencies
npm install

# Run the app locally (port 3000)
node server.js

# Run tests
npm test

# Run a single test file
npx jest tests/server.test.js

# Lint
npm run lint
npm run lint:fix

# Build Docker image
docker build -t kryptostream .

# Run Docker container
docker run -p 3000:3000 kryptostream
```

## Architecture

- **`server.js`** — Express.js server on port 3000. Contains intentional vulnerabilities (CVE-2022-29078 EJS template injection, prototype pollution via lodash, hardcoded credentials, insecure session cookie).
- **`views/pages/index.ejs`** — Single EJS template rendered by the server. Demonstrates the EJS RCE vulnerability interactively.
- **`public/`** — Static assets (Bootstrap CSS/JS, jQuery, images).
- **`Dockerfile`** — Builds using `node:20-slim`; installs JFrog CLI for secure artifact resolution. Copies `server.js`, `public/`, `views/`.
- **`main.tf`** — Terraform config for AWS (EC2 t2.micro, security group, S3 state bucket).

## CI/CD (GitHub Actions)

All workflows use **JFrog OIDC authentication** (`ptfl-github` provider, `ptfl-aud` audience) — no stored credentials.

| Workflow | Trigger | Purpose |
|---|---|---|
| `swampup-ci.yml` | `workflow_dispatch` | Full pipeline: npm audit → Docker build/push → Xray scan → release bundle → promote to DEV |
| `frogbot-scan-pull-request.yml` | PR open/sync | Security scan PRs via Frogbot (requires `frogbot` environment approval) |
| `frogbot-scan-and-fix2.yml` | Push to `main` | Auto-create PRs with dependency vulnerability fixes |
| `promote-to-qa.yaml` | `workflow_dispatch` | Promote a release bundle to QA or PROD |

**Key workflow inputs for `swampup-ci.yml`:** environment set, npm curation toggle, Xray audit toggle, JFrog project/URL configuration.

**JFrog repositories used:**
- `kryptostream-npm-remote` — NPM proxy
- `kryptostream-npm-curated-dev-remote` — NPM curation
- `kryptostream-docker-dev-local` — Docker images
- `ptfl-oci-dev-local` — OCI promotion target

**Secrets required:** `PRIVATE_KEY`, `KEY_ALIAS`, `RB_KEY` (release bundle signing)
**Variables required:** `JF_URL`, `JF_PROJECT`
