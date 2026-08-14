# Caelum — Backend API (Caelum_server)

A production-ready, TypeScript-based REST API for an eCommerce watches platform. Built with Express, Prisma (Postgres), Stripe payments, JWT authentication, and Zod input validation. This repository contains the server for the Caelum project and is suitable for demonstration in a portfolio or technical review.

**Repository:** server

**Quick highlights:**

- **Fully typed** with TypeScript and modern toolchain (`tsx`, `tsc`).
- **Reliable data access** using Prisma and PostgreSQL.
- **Auth**: Secure password hashing with `argon2`, JWT-based access/refresh tokens, HTTP-only cookies.
- **Payments**: Integrated Stripe payment handling.
- **Input validation** with `zod` and central error handling.
- **Environment-ready**: typed config, structured routes for admin/customer/public/payment.

**Tech stack**: TypeScript, Node.js, Express, Prisma, PostgreSQL, Stripe, Zod, Argon2, JSON Web Tokens.

**Table of contents**

- **Overview**
- **Features**
- **Architecture**
- **Getting started**
- **Environment variables**
- **Database (Prisma)**
- **Scripts**
- **API surface**
- **Security & best practices**
- **For recruiters / clients**
- **Contributing**
- **Contact**

**Overview**

This project implements a backend API for an eCommerce application selling watches. The API exposes public product endpoints, customer flows (signup, signin, orders), admin management endpoints, and payment processing via Stripe. The server is designed to be deployable to any environment that supports Node.js and Postgres.

**Features**

- User authentication and admin authentication with separate routes and services.
- Strong password hashing using `argon2`.
- Short-lived access tokens and refresh tokens for improved security.
- Input schemas powered by `zod` for predictable validation and typed request handling.
- Payment processing via Stripe (server-side capture + webhook-ready architecture).
- Centralized error handling and typed `AppError`.
- Modular route structure: `public`, `customer`, `admin`, and `payment` modules.

**Architecture**

- `src/app.ts`: Express app, middleware, and top-level routes.
- `src/server.ts`: Entrypoint — loads env, connects Prisma, starts the HTTP server.
- `src/config/db.ts`: Prisma client and database configuration.
- `src/customer`, `src/admin`, `src/public`: feature areas with controllers, services, and routes.
- `src/global`: shared utilities (`AppError`, `catchAsync`, response helpers).
- `src/middleware`: error-handling and auth middlewares.
- `prisma/` and `generated/`: Prisma schema and generated client types.

This separation keeps business logic testable and easy to navigate.

**Getting started (local)**

Prerequisites

- Node.js (recommended 18+)
- PostgreSQL (local or hosted)
- A Stripe account (for payments)

Install

```bash
# from repository root
cd server
npm install
```

Environment
Create a `.env` file at the project root (or supply env vars through your environment). Minimum required variables are validated when the server starts.

Example `.env` (safely store secrets in your environment for production):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/caelum_db
PORT=5000
CLIENT_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_secret_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here
STRIPE_SECRET=sk_test_...
```

Database (Prisma)

Generate the client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Run (development)

```bash
npm run dev
```

Build & Run (production)

```bash
npm run build
npm start
```

**Scripts** (from `package.json`)

- `dev`: Run with `tsx` in watch mode — great for local development.
- `build`: Compile TypeScript to JavaScript using `tsc`.
- `start`: Run the compiled `dist/server.js`.

**Environment variables (required at startup)**

- `DATABASE_URL`: Postgres connection string.
- `PORT`: Port to serve the API (default is 5000).
- `ACCESS_TOKEN_SECRET`: JWT access token secret.
- `REFRESH_TOKEN_SECRET`: JWT refresh token secret.
- `STRIPE_SECRET`: Stripe server secret key.

**API surface (high level)**

- `GET /` — health check, returns "Server is running!".
- `POST /auth/user/*` — customer auth flows (signup, signin, refresh token).
- `POST /auth/admin/*` — admin auth flows.
- `GET /api/*` — public product listings and details.
- `GET/POST /api/customer/*` — customer-only endpoints (orders, profile).
- `GET/POST /api/admin/*` — admin-only endpoints for managing products, orders, categories.
- `POST /api/payment/*` — payment creation and webhook handling.

Refer to the route files for exact endpoints and request schemas.

**Security & best practices included**

- Passwords hashed with `argon2`.
- JWT access & refresh token separation with secure storage (HTTP-only cookies recommended).
- CORS with `CLIENT_URL` and `credentials: true` configured.
- Centralized error handling middleware and typed `AppError`.
- Input validation with `zod` to avoid invalid data reaching business logic.

**Developer notes / How it stands out**

- Clean separation of controllers and services to keep controllers thin and business logic testable.
- Type-safe Prisma client under `generated/` for autocompletion and compile-time checks.
- Designed to be extended with webhooks (Stripe), email providers, or background job processing.

**For recruiters / clients — what to look for**

- Clear separation of concerns: controllers, services, routes, and config.
- Production-minded choices: typed codebase, secure defaults, and structured migrations.
- Real integrations: Stripe payments and Postgres via Prisma demonstrate ability to ship a real product.
- Testing & extension points are easy to add due to modular services.

**Contributing**

- Fork and clone the repo.
- Create a feature branch: `git checkout -b feat/your-feature`.
- Run and test locally using `npm run dev`.
- Open a PR with a description of changes and any migration steps.

**Contact**
If you'd like a walkthrough or tailored version for a live demo, get in touch — examples, Postman collections, or API docs can be added on request.

---

Generated on project inspection. If you want, I can:

- Add a short API reference (endpoint list + request/response examples).
- Add a Postman collection / OpenAPI spec.
- Tailor the README to a specific job posting or client brief.
