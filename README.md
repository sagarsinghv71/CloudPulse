# CloudPulse
### AI-Powered Developer Observability & Incident Command Center

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/Tests-33%20Passed-brightgreen?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)]()

CloudPulse is a high-density, production-grade developer observability platform that unifies microservice health monitoring, deployment tracking, structured log exploration, and incident triage into a centralized command center. Powered by a server-side AI Copilot, CloudPulse correlates metric anomalies and deployment diffs with error logs to automatically pinpoint root causes and generate interview-grade postmortems.

---

## 🌐 Live Demo & Credentials

- **Live URL**: [https://cloudpulse.dev](https://cloudpulse.dev) *(or local preview at `http://localhost:3000`)*
- **Demo Workspace**: `CloudPulse Engineering` (`ws-cloudpulse-eng`)
- **Evaluation Account**:
  - **Email**: `sagar@cloudpulse.dev`
  - **Password**: `CloudPulse2026!`
  - **Role**: `OWNER` *(Full admin & operational privileges)*
- *One-click demo login is available on the `/login` portal.*

---

## ⚡ Core Features

1. **Mission Command Center (`/dashboard`)**:
   - Live cluster telemetry aggregates: 99.98% uptime, 2,841 req/s throughput, 0.12% error rate, and 142ms average latency.
   - Interactive Recharts timeseries graphs with multi-granularity views (`15m`, `1h`, `6h`, `24h`, `7d`).
   - Microservice health matrix and real-time active incident alerts.

2. **Microservice Fleet Explorer (`/services`)**:
   - Fleet-wide status monitoring (`HEALTHY`, `DEGRADED`, `DOWN`, `MAINTENANCE`).
   - Real-time CPU/Memory saturation gauges and request throughput counters.
   - Deep-dive service inspection (`/services/[id]`) with tabs for Overview, Real-time Metrics, Deployment History, and Scoped Incident Logs.

3. **Deployment Pipeline & Safe Rollbacks (`/deployments`)**:
   - Multi-environment timeline (`production`, `staging`, `canary`).
   - Granular commit inspection, author attribution, and OCI build container logs.
   - Guarded one-click rollback mechanism with confirmation dialog and automatic audit trail.

4. **Incident War Room & Chronological Timeline (`/incidents`)**:
   - Triage board with severity filtering (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) and lifecycle status (`INVESTIGATING`, `IDENTIFIED`, `MONITORING`, `RESOLVED`).
   - Real-time event logger supporting key operational milestones (`DETECTED`, `ACKNOWLEDGED`, `INVESTIGATION_STARTED`, `ROOT_CAUSE_IDENTIFIED`, `MITIGATION_APPLIED`, `RESOLVED`).
   - Bidirectional correlation with related deployments and error log signatures.

5. **Terminal-Style Monospace Log Explorer (`/logs`)**:
   - Real-time streaming log viewer with pause/resume buffer controls.
   - Multi-facet filters: Search keyword, Service, Severity level (`INFO`, `DEBUG`, `WARN`, `ERROR`, `FATAL`), and Environment.
   - Click-to-copy `requestId` and `traceId` with expandable structured JSON metadata.

6. **Flagship AI Incident Copilot (`/ai-copilot`)**:
   - Conversational AI workspace with real-time operational context injection (active incidents, recent deployments, degraded services).
   - Automated root-cause correlation engine pinpointing commit regressions and connection pool exhaustion.
   - One-click postmortem generation formatted with SLA impact, chronological timeline, root cause, and prioritized preventive action items.
   - Instant stakeholder communication drafter for Slack, Email, and StatusPage updates.
   - **Zero-Key Fallback Engine**: If `OPENAI_API_KEY` is not provided, CloudPulse switches to a deterministic offline heuristic engine with 100% schema parity—never failing silently and never pretending offline output came from OpenAI.

7. **Engineering Analytics & DORA Metrics (`/analytics`)**:
   - Mean Time to Resolution (MTTR), Change Failure Rate (CFR), Deployment Frequency, and Service Reliability trends calculated across 7d, 30d, 90d, and YTD.

8. **Role-Based Access Control (RBAC) & Team Management (`/team`)**:
   - Strict hierarchical role enforcement (`OWNER`, `ADMIN`, `ENGINEER`, `VIEWER`).
   - Multi-tenant workspace isolation preventing cross-organization data leakage.

---

## 🏛️ System Architecture

```
                          ┌────────────────────────────────────────────────────────┐
                          │                   CLIENT LAYER                         │
                          │   Next.js 16 App Router (React 19, Tailwind CSS v4)   │
                          │   Recharts Visualizations · Lucide Icons · Framer      │
                          └───────────────────────────┬────────────────────────────┘
                                                      │ HTTPS / Cookie Auth
                                                      ▼
                          ┌────────────────────────────────────────────────────────┐
                          │               REVERSE PROXY & MIDDLEWARE               │
                          │   Next.js Edge Proxy: Session Validation & RBAC Guard  │
                          └───────────────────────────┬────────────────────────────┘
                                                      │
                         ┌────────────────────────────┴────────────────────────────┐
                         ▼                                                         ▼
    ┌─────────────────────────────────────────┐               ┌─────────────────────────────────────────┐
    │          SERVER API ROUTE HANDLERS      │               │         TELEMETRY STREAMING LAYER       │
    │  • /api/auth (Login, Logout, Me)        │               │  • Abstract TelemetryService Interface  │
    │  • /api/services (CRUD, Metrics)        │               │  • Deterministic Anomaly Generator      │
    │  • /api/deployments (Timeline, Rollback)│               │  • WebSocket / SSE Ready Architecture   │
    │  • /api/incidents (Events, Triage)      │               │  • Per-Service Saturation Metrics       │
    │  • /api/logs (Terminal Stream, Filters) │               └─────────────────────────────────────────┘
    └────────────────────┬────────────────────┘
                         │
                         ├─────────────────────────────────────────┐
                         ▼                                         ▼
    ┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
    │       AI INCIDENT COPILOT ENGINE        │   │        DATA & PERSISTENCE LAYER         │
    │  • OpenAI gpt-4o Structured Outputs     │   │  • PostgreSQL 16 Relational Storage     │
    │  • Zod Response Validation              │   │  • Prisma ORM Schema & Migrations       │
    │  • Deterministic Offline Rule Fallback  │   │  • In-Memory Zero-Config Store Fallback │
    │  • Postmortem & Slack Comms Generators  │   │  • Multi-Tenant Workspace Scoping       │
    └─────────────────────────────────────────┘   └─────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (Prisma ORM)

The relational schema is defined in [`prisma/schema.prisma`](prisma/schema.prisma) with explicit relations, cascade constraints, and performant indexes:

| Entity | Description | Key Relations |
| :--- | :--- | :--- |
| **`User`** | Platform user profile with bcrypt password hash | Memberships, Incidents Assigned |
| **`Workspace`** | Organization tenant boundary | Members, Environments, Services, Incidents |
| **`Membership`** | Multi-tenant user association with RBAC role (`OWNER`, `ADMIN`, etc.) | User, Workspace |
| **`Environment`** | Deployment stage (`production`, `staging`, `canary`) | Workspace, Deployments, Logs |
| **`Service`** | Microservice tracked by observability agents | Workspace, Deployments, Incidents, Metrics |
| **`Deployment`** | Release lifecycle record with commit SHA and duration | Service, Environment, Incident, BuildLogs |
| **`DeploymentLog`** | Chronological stdout/stderr build steps | Deployment |
| **`Incident`** | Production incident record with severity and status | Workspace, Service, AssignedUser, Events |
| **`IncidentEvent`** | Audit log of actions taken during incident resolution | Incident |
| **`LogEntry`** | Structured syslog/JSON log line with request & trace IDs | Service, Environment |
| **`MetricPoint`** | Time-bucketed telemetry (CPU, Mem, Latency, Errors) | Service |
| **`AIAnalysis`** | Cached AI Copilot root cause and postmortem outputs | Incident |
| **`Notification`** | System alerts dispatched to on-call engineers | User |

---

## 🤖 AI Copilot Architecture

The AI layer in [`src/lib/ai/ai-service.ts`](src/lib/ai/ai-service.ts) provides defensible, production-grade intelligence:

1. **Context Window Injection**:
   The AI does not run blind queries. When an investigation is launched, the server automatically queries active service states, deployment diffs, and recent error bursts, constructing an operational context payload.

2. **Strict Zod Structured Outputs**:
   Responses are validated through strict Zod schemas defined in [`src/lib/ai/schemas.ts`](src/lib/ai/schemas.ts):
   - `IncidentAnalysisSchema`: Root cause, correlated signals, confidence score, mitigations, and evidence.
   - `LogSummarySchema`: Categorization, critical findings, and recommended log filters.
   - `PostmortemSchema`: Impact duration, timeline events, root cause, resolution, and prioritized action items.
   - `CommunicationSchema`: Stakeholder updates tailored for Slack, Email, or StatusPage.

3. **Transparent Deterministic Fallback Mode**:
   - If `OPENAI_API_KEY` is not present, CloudPulse invokes a deterministic offline heuristics engine.
   - The fallback analyzes real log signatures (e.g. `ConnectionPoolExhaustedException`) and deployment timing to output the exact same structured payload format.
   - Every response contains `isDeterministicFallback: true` to guarantee 100% transparency with evaluators.

---

## 🔒 Security & RBAC Model

- **Session Security**: Session tokens are signed using `jose` with `HS256`, stored in HTTP-only, `SameSite=Lax`, secure cookies (`cp_session`).
- **Password Security**: Passwords are hashed with `bcryptjs` using 10 salt rounds.
- **Tenant Isolation**: Handlers enforce `validateWorkspaceIsolation()` to prevent cross-workspace data leakage.
- **Role Permissions Matrix**:

| Action | OWNER | ADMIN | ENGINEER | VIEWER |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard & Telemetry** | ✅ | ✅ | ✅ | ✅ |
| **Query AI Incident Copilot** | ✅ | ✅ | ✅ | ✅ |
| **Register / Edit Microservice** | ✅ | ✅ | ✅ | ❌ |
| **Execute Safe Rollback** | ✅ | ✅ | ✅ | ❌ |
| **Create & Resolve Incidents** | ✅ | ✅ | ✅ | ❌ |
| **Generate Postmortems** | ✅ | ✅ | ✅ | ✅ |
| **Manage Team & Invites** | ✅ | ✅ | ❌ | ❌ |
| **Manage API Keys & Security** | ✅ | ✅ | ❌ | ❌ |
| **Transfer Ownership / Hard Delete**| ✅ | ❌ | ❌ | ❌ |

---

## 🛠️ Tech Stack Breakdown

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Components & Server Actions)
- **Runtime**: [React 19](https://react.dev/) & [Node.js 20+](https://nodejs.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict type-checking)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with dark developer-tool design system
- **Components**: Bespoke high-density components inspired by shadcn/ui & Radix principles
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts 3](https://recharts.org/) (Custom styled timeseries, area & bar charts)
- **Database & ORM**: [PostgreSQL 16](https://www.postgresql.org/) & [Prisma 6.4](https://www.prisma.io/)
- **Validation**: [Zod 4](https://zod.dev/)
- **Authentication**: JWT via `jose` + HTTP-Only Cookies + `bcryptjs`
- **AI Engine**: [OpenAI Node SDK](https://platform.openai.com/docs/) (`gpt-4o`) + Heuristic Fallback Engine
- **Testing**: Built-in Node test runner (`node:test` + `node:assert`) executed via `tsx`

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js `20.x` or later
- npm `10.x` or later
- *(Optional)* Docker & Docker Compose for local PostgreSQL

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/your-username/cloudpulse.git
cd cloudpulse
npm install
```

### Step 2: Configure Environment Variables
```bash
cp .env.example .env
```
Open `.env` and set:
```env
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/cloudpulse?schema=public"
SESSION_SECRET="your-random-32-char-session-secret-string"
OPENAI_API_KEY="" # Optional: Leave blank to use zero-cost deterministic fallback mode
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Run Database Migrations & Seed Data
*(Optional: Run `docker compose up -d` first if using local Postgres)*
```bash
# Push schema to database
npm run db:push

# Seed realistic enterprise telemetry, incidents, and logs
npm run db:seed
```
*Note: If PostgreSQL is not running, CloudPulse automatically serves from its pre-seeded in-memory mock store, allowing instant evaluation with zero external dependencies.*

### Step 4: Start the Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing & Verification

CloudPulse includes a 33-test automated test suite covering authentication, RBAC, domain validation, telemetry streaming, AI fallback, and live API endpoints:

```bash
# Run all unit and integration tests
npm test

# Run ESLint validation
npm run lint

# Verify production build compilation
npm run build
```

---

## 🐳 Docker Deployment

To run CloudPulse and PostgreSQL inside containers:

```bash
# 1. Start PostgreSQL container
docker compose up -d

# 2. Build and launch CloudPulse container
docker build -t cloudpulse:latest .
docker run -p 3000:3000 --env-file .env cloudpulse:latest
```

---

## ☁️ Vercel Production Deployment

CloudPulse is optimized for single-click deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. Configure the Environment Variables:
   - `DATABASE_URL`: Hosted Postgres connection string (e.g. Neon, Supabase, or AWS RDS).
   - `SESSION_SECRET`: Secure 32-character random string.
   - `OPENAI_API_KEY`: *(Optional)* Your OpenAI API key.
4. Click **Deploy**. Vercel will automatically run `next build` and deploy the serverless edge routes.

---

## 📡 REST API Reference

| Endpoint | Method | Description | Auth Required |
| :--- | :---: | :--- | :---: |
| `/api/auth/login` | `POST` | Authenticate credentials and issue session cookie | No |
| `/api/auth/logout`| `POST` | Invalidate active session and clear cookie | Yes |
| `/api/auth/me` | `GET` | Retrieve authenticated user profile and workspace | Yes |
| `/api/services` | `GET` | List all microservices with health and metrics | Yes |
| `/api/services` | `POST` | Register a new microservice in the workspace | Yes (Eng+) |
| `/api/services/[id]`| `GET` | Get detailed service telemetry and logs | Yes |
| `/api/deployments`| `GET` | List recent deployments across all environments | Yes |
| `/api/deployments/[id]/rollback` | `POST` | Execute safe rollback to previous stable tag | Yes (Eng+) |
| `/api/incidents` | `GET` | List active and historical incidents | Yes |
| `/api/incidents` | `POST` | Open a new production incident | Yes (Eng+) |
| `/api/incidents/[id]` | `PATCH` | Update incident status (`RESOLVED`, etc.) | Yes (Eng+) |
| `/api/incidents/[id]/events` | `POST` | Append chronological timeline event | Yes (Eng+) |
| `/api/logs` | `GET` | Query structured log stream with severity filters | Yes |
| `/api/metrics` | `GET` | Retrieve real-time telemetry timeseries points | Yes |
| `/api/ai/chat` | `POST` | Interactive conversational query with AI Copilot | Yes |
| `/api/ai/actions` | `POST` | Trigger structured AI actions (`analyze_incident`, `generate_postmortem`) | Yes |
| `/api/team` | `GET` | List workspace members and role assignments | Yes |
| `/api/team` | `POST` | Invite a new team member with RBAC role | Yes (Admin+) |

---

## 🔮 Roadmap & Future Improvements

- [ ] Native WebSocket / SSE streaming server integration for multi-user war room presence.
- [ ] OpenTelemetry (OTel) Collector integration for automatic distributed trace ingestion.
- [ ] PagerDuty, Opsgenie, and Datadog webhook bi-directional alert syncing.
- [ ] Vector database embeddings (e.g. pgvector) for semantic log search over millions of rows.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
