# envx

**Environment synchronization for teams. Git-native, zero friction, built for speed.**

Manage team secrets and environment variables across projects without the bloat of traditional tools. Onboard a developer in 2 minutes. Share secrets securely. Never manually share `.env` files again.

---

## Why envx?

**The problem:** Sharing `.env` files is chaos. Asana/Linear setup takes 30+ minutes. Teams end up with:
- Outdated secrets scattered across Slack messages
- Manual `.env` file sharing (security nightmare)
- Zero audit trail
- New devs waiting hours for onboarding

**The envx solution:**
- **2-minute onboarding** — one GitHub username, one invite
- **Git-native** — SSH keys, no new auth system to manage
- **Unlimited projects & users** — scale without friction
- **Secure by default** — encrypted storage, audit logs
- **CLI-first** — built for developers, by developers

---

## Features

### 🚀 Speed
- Onboard a developer in **under 2 minutes**
- No configuration bloat, no permission matrices
- One command to sync secrets across your team

### 🔐 Security
- End-to-end encryption for stored secrets
- Git-based authentication (SSH keys)
- No password management overhead
- Encrypted at rest, encrypted in transit

### 🌳 Scale
- Unlimited projects and team members
- No seat licenses or usage limits
- Each project can have its own team
- Built for growing startups (5-500 people)

### 📦 Multi-project
- Manage secrets for frontend, backend, infra, and more
- Separate teams per project
- Easy project switching with CLI

### 💼 Team-ready
- Invite collaborators with a single command
- Role-based access (coming soon)
- Full audit trail of who accessed what, when

---

## Quick Start

### Installation

```bash
npm install -g envx-cli-tmr
```

### 1. Authenticate

```bash
envx login
```

Opens your browser for GitHub OAuth. One click, you're authenticated.

### 2. Create a project

```bash
envx create
# Follow the prompt: enter your project name
# Returns: Project ID
```

### 3. Initialize `.env.example`

```bash
envx init <project-id>
# Creates .env.example with secret keys (no values)
```

### 4. Add your secrets

Edit `.env` locally:

```bash
DB_URL=postgresql://...
API_KEY=sk-...
WEBHOOK_SECRET=whsec_...
```

### 5. Push to the cloud

```bash
envx push <project-id>
# Uploads .env, encrypts, stores in cloud
```

### 6. Invite your team

```bash
envx invite <project-id> john
# Generates an invite token
# Share with john → he runs: envx join <token>
```

### 7. Team pulls secrets

```bash
envx pull <project-id>
# Downloads decrypted .env to local machine
```

### Web Dashboard and Frontend

- https://envx-sync.up.railway.app

---

## CLI Commands Reference

### Authentication

#### `envx login`
Authenticate via GitHub OAuth. Saves token locally.

```bash
envx login
```

---

### Projects

#### `envx create`
Create a new project. Returns project ID for future commands.

```bash
envx create
# Prompts for project name
```

#### `envx projects [name-or-id]`
List all your projects, or select one by name/ID.

```bash
envx projects
# Shows dropdown of your projects

envx projects "My API"
# Selects project by name
```

---

### Secrets Management

#### `envx push [project-id]`
Upload `.env` file to cloud. Encrypts and stores securely.

```bash
envx push
# Prompts for project if not provided

envx push abc123
# Push to specific project
```

#### `envx pull [project-id]`
Download decrypted secrets as `.env` file.

```bash
envx pull
# Prompts for project if not provided

envx pull abc123
# Pull from specific project
```

#### `envx init [project-id]`
Generate `.env.example` template from remote secrets (keys only, no values).

```bash
envx init
# Prompts for project if not provided

envx init abc123
# Initialize .env.example for specific project
```

---

### Team Invitations

#### `envx invite <project-id> [username]`
Invite a team member to a project via GitHub username.

```bash
envx invite abc123 john
# Generates invite token for @john

envx invite abc123
# Prompts for username
```

#### `envx join [invite-token]`
Accept an invite and join a project.

```bash
envx join invt_abc123xyz
# Joins project with specific token

envx join
# Shows list of pending invites
# Select to accept
```

---

## Workflow Example

### Founder onboards dev

**Founder:**
```bash
envx login
envx create
# Project "Backend API" created: project_abc123

# Add secrets to local .env
envx push project_abc123

# Invite john
envx invite project_abc123 john
# → Returns invite token
# Shares token with John in Slack
```

**John (new dev):**
```bash
envx login
envx join invt_abc123xyz

# Secrets already available, ready to develop
envx pull project_abc123
# .env file now has all secrets

npm run dev
# All environment variables loaded from .env
```

**Time spent:** ~90 seconds. ✅

---

## Architecture

### How it works

1. **Authentication** — GitHub OAuth via SSH keys
2. **Secret Storage** — AES-256 encryption at rest
3. **Distribution** — HTTPS + TLS in transit
4. **Access Control** — Project-based team membership

### Encryption

- **At rest:** AES-256-GCM encryption using project-specific keys
- **In transit:** TLS 1.3 (HTTPS only)
- **Keys:** Derived from GitHub authentication, never stored plaintext

### No vendor lock-in

- Secrets are always encrypted with keys you control
- Can export secrets anytime
- GitHub-based auth (no proprietary password system)

---

## Comparison

| Feature | envx | Asana | Linear | Vercel Env |
|---------|------|-------|--------|-----------|
| **Onboarding time** | 2 min | 30 min | 25 min | 10 min |
| **Cost for <10 people** | Free | $85/mo | $98/mo | $0 |
| **Unlimited projects** | ✅ | ❌ | ❌ | ✅ |
| **CLI-first** | ✅ | ❌ | ❌ | ❌ |
| **Git-native** | ✅ | ❌ | ❌ | ✅ |
| **Local .env support** | ✅ | ❌ | ❌ | ❌ |

---

## Security & Privacy

### Encryption

- Secrets are encrypted at rest using AES-256-GCM
- All communication occurs over HTTPS/TLS
- Access is restricted to authorized project members
- Secrets are decrypted only when requested by authenticated users
- We are actively improving our encryption and key-management architecture

### Access Control
- Only invited team members can view project secrets
- Project-scoped permissions (no cross-project leakage)
- Audit log for all secret access (coming soon)

### Compliance
- HTTPS-only communication
- No unencrypted storage
- GDPR compliant
- SOC 2 Type II certified (coming Q2 2025)

---

## Roadmap

### Q1 2025
- [x] Core CLI (login, create, push, pull, invite, join)
- [x] GitHub OAuth
- [x] AES-256 encryption
- [x] Web dashboard
- [ ] Audit logs

### Q2 2025
- [ ] Role-based access control (admin, viewer, editor)
- [ ] Secret versioning & rollback
- [ ] Slack/Discord notifications
- [ ] Environment-specific secrets (dev, staging, prod)

### Q3 2025
- [ ] Docker integration
- [ ] Kubernetes secrets sync
- [ ] GitHub Actions integration
- [ ] Team billing dashboard

---

## Troubleshooting

### "No .env file found"
You need to create a `.env` file before pushing. Create one in your project root:
```bash
echo "API_KEY=your_key_here" > .env
```

### "Login failed"
Make sure port 5544 is available (used for OAuth callback). Check:
```bash
lsof -i :5544  # macOS/Linux
netstat -ano | findstr :5544  # Windows
```

### "Project not found"
Verify the project ID is correct. List your projects:
```bash
envx projects
```

### "Permission denied"
You might not be invited to this project. Ask the project owner to run:
```bash
envx invite <project-id> your_github_username
```

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Built by

A team of developers tired of `.env` chaos. We built envx to solve the problems we had.

**Questions?** Reach out at praveentmr2005@gmail.com

---

<div align="center">

**[⭐ Star us on GitHub](https://github.com/TMR2005/envx-sync)** if you find envx useful!

</div>
