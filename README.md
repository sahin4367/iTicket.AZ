# iTicket.AZ — Event Ticketing Platform

A production-grade event ticketing backend built with Node.js and TypeScript,
featuring real-time seat reservation, fault-tolerant architecture,
and HashiCorp Consul service discovery.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20, TypeScript |
| Framework | Express.js |
| Database | PostgreSQL + TypeORM |
| Real-time | Socket.IO |
| Auth | JWT |
| Payment | PayPal SDK |
| Email | Nodemailer |
| Scheduler | node-cron |
| Container | Docker + Docker Compose |
| Service Discovery | HashiCorp Consul |
| CI/CD | GitHub Actions |

---

## Architecture

This project applies enterprise-grade fault-tolerance patterns:

- **Circuit Breaker** — prevents cascade failures when the database is unavailable
- **Health Checks** — `/api/v1/health` endpoint monitored by Consul every 10s
- **Service Discovery** — Consul automatically deregisters unhealthy instances
- **Graceful Degradation** — partial failures don't bring down the whole system
- **Async Job Queue** — critical operations survive server restarts
- **Container Orchestration** — `restart: unless-stopped` ensures automatic recovery

---

## Services

| Service | Port | Description |
|---|---|---|
| iticket-api | 3000 | Main REST + WebSocket API |
| PostgreSQL | 5432 | Primary database |
| Consul | 8500 | Service discovery + health monitoring |

---

## Getting Started

### Prerequisites

- Docker + Docker Compose
- Node.js 20 (for local dev)

### Run with Docker (recommended)

```bash
git clone https://github.com/sahin4367/iTicket.AZ
cd iTicket.AZ
cp .env.example .env   # fill in your values
docker-compose up --build
```

Consul UI: http://localhost:8500
API: http://localhost:3000/api/v1/health

### Run locally

```bash
npm install
npm run dev
```

---

## Environment Variables

```env
PORT=
DB_HOST=localhost
DB_PORT=
DB_NAME=your_DB_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret
USER_EMAIL=your@gmail.com
PASSWORD=your_email_password
CONSUL_HOST=localhost
```

---

## Project Structure
src/
├── Core/
│   ├── API/          # Route controllers (User, Ticket, Event, Order)
│   ├── Jobs/         # Cron jobs (expired reservation cleanup)
│   └── Middlewares/  # Auth, circuit breaker
├── DAL/
│   ├── config/       # TypeORM data source
│   └── models/       # Entity definitions
├── consts.ts
├── helpers.ts
└── index.ts          # App entry point — Express, Socket.IO, Consul registration

---

## Key Features

**Ticket Reservation System**
15-minute hold on selected tickets, automatically released via cron job if payment is not completed.

**Real-time Updates**
Socket.IO broadcasts seat availability changes to all connected clients instantly.

**Fault Tolerance**
Service registers with Consul on startup. If the `/health` endpoint returns `503`, Consul marks the instance as critical and deregisters it after 30 seconds — no manual intervention needed.

**CI/CD**
GitHub Actions runs type checking and Docker build verification on every push to `main`.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/v1/health | System health check |
| POST | /api/v1/auth/register | User registration |
| POST | /api/v1/auth/login | JWT login |
| GET | /api/v1/events | List events |
| POST | /api/v1/tickets/reserve | Reserve ticket |
| POST | /api/v1/orders | Create order |
| POST | /api/v1/orders/pay | Process payment |

---

## Demo

https://dev.to/shahin-qlvlrk043/building-a-fault-tolerant-nodejs-backend-4-patterns-i-applied-to-my-ticketing-app-1a99

---

## CI Status

![CI](https://github.com/sahin4367/iTicket.AZ/actions/workflows/ci.yml/badge.svg)
