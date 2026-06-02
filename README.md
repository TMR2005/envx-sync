# envx

> Environment synchronization for teams. Git-native, zero friction, built for speed.

---

Sharing `.env` files over Slack is a security incident waiting to happen. Manual onboarding takes hours. Secrets go stale. `envx` eliminates all of it — encrypted secret management with two-minute developer onboarding, powered by the GitHub accounts your team already has.

---

## Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Reference](#cli-reference)
- [Architecture](#architecture)
- [Security](#security)
- [Roadmap](#roadmap)
- [Troubleshooting](#troubleshooting)

---

## Installation

```bash
npm install -g envx-cli-tmr
```

Requires Node.js. No additional dependencies.

---

## Quick Start

### 1. Authenticate

```bash
envx login
```

Opens GitHub OAuth in your browser. Authentication uses your existing GitHub account — no new credentials to manage.

### 2. Create a project

```bash
envx create
# Prompts for a project name
```

### 3. Push your secrets

Add variables to your local `.env` file, then upload:

```bash
envx push
# Select from a dropdown of your projects
```

### 4. Invite a teammate

```bash
envx invite <github-username>
# Invite sent — no tokens to copy or share
```

### 5. Teammate accepts and pulls

```bash
# Teammate runs:
envx join
# Shows a dropdown of pending invites — select to accept

envx pull
# Select the project from a dropdown
# .env is populated with all secrets
```

Total time from zero to running: under two minutes.

---

## CLI Reference

### Authentication

#### `envx login`

Authenticate via GitHub OAuth. Credentials are stored locally.

```bash
envx login
```

---

### Projects

#### `envx create`

Create a new project.

```bash
envx create
# Prompts for a project name
```

#### `envx projects`

List all projects you have access to. Presents an interactive dropdown to select one.

```bash
envx projects
```

---

### Secrets Management

All secrets commands present an interactive project dropdown if no project is pre-selected.

#### `envx push`

Upload your local `.env` file. Encrypted server-side before storage.

```bash
envx push
# Select project from dropdown
```

#### `envx pull`

Download decrypted secrets as a `.env` file in your current directory.

```bash
envx pull
# Select project from dropdown
```

#### `envx init`

Generate a `.env.example` template containing only variable keys — no values. Safe to commit to version control.

```bash
envx init
# Select project from dropdown
```

---

### Team Management

#### `envx invite <github-username>`

Invite a teammate by their GitHub username. No token exchange required — the invite is sent server-side and appears in their `envx join` queue.

```bash
envx invite john
```

#### `envx join`

Shows a dropdown of all pending invites addressed to you. Select one to accept and gain project access.

```bash
envx join
```

---

## Architecture

```
Developer Machine         envx Cloud              Teammate Machine
─────────────────         ──────────              ────────────────
.env
  │
  ▼
HTTPS / TLS 1.3 ────────► AES-256-GCM encrypt ──► Decrypt on pull
                                  │
                           Master key (env)
                           Access control
                           Audit log
```

**Authentication** — GitHub OAuth. No proprietary identity system. Your team's existing GitHub accounts are the source of truth.

**Encryption** — All secrets are encrypted at rest using AES-256-GCM with a master key stored outside the server in environment configuration. No plaintext secrets are persisted at any layer.

**Encryption in transit** — TLS 1.3. HTTPS only.

**Access control** — Project-scoped membership. Access to one project does not grant access to any other.

**Audit log** — Every secret access is recorded with user identity and timestamp.

---

## Security

| Property | Detail |
|----------|--------|
| Encryption at rest | AES-256-GCM |
| Key storage | Master key in environment config, outside the server |
| Encryption in transit | TLS 1.3 |
| Authentication | GitHub OAuth |
| Access scope | Per-project, no cross-project leakage |
| Plaintext storage | Never |
| Audit logging | Full access log — who pulled what, and when |
| Compliance | GDPR compliant; SOC 2 Type II in progress |

Secrets are decrypted only upon request by an authenticated, authorized project member.

Security disclosures: praveentmr2005@gmail.com

---

## Web Dashboard

A browser-based interface is available alongside the CLI:

```
https://envx-sync.up.railway.app
```

---

## Roadmap

### Q1 2025
- [x] Core CLI — `login`, `create`, `push`, `pull`, `invite`, `join`
- [x] GitHub OAuth
- [x] AES-256 encryption
- [x] Web dashboard
- [x] Audit logs

### Q2 2025
- [ ] Role-based access control (admin, viewer, editor)
- [ ] Secret versioning and rollback
- [ ] Slack and Discord notifications
- [ ] Environment-specific secrets (dev, staging, prod)

### Q3 2025
- [ ] Docker integration
- [ ] Kubernetes secrets sync
- [ ] GitHub Actions integration
- [ ] Team billing dashboard

---

## Troubleshooting

**"No .env file found"**

A `.env` file must exist in your working directory before pushing:

```bash
echo "API_KEY=your_key_here" > .env
```

**"Login failed"**

The OAuth callback uses port `5544`. Ensure it is available:

```bash
# macOS / Linux
lsof -i :5544

# Windows
netstat -ano | findstr :5544
```

**"Permission denied"**

You have not been invited to this project. Ask the project owner to run:

```bash
envx invite <your-github-username>
```

---

## Contributing

Issues and pull requests are welcome on the [GitHub repository](https://github.com/TMR2005/envx-sync).

---

## License

MIT — see [LICENSE](./LICENSE) for full terms.

---

Built by developers who got tired of the `.env` problem. Questions: praveentmr2005@gmail.com
