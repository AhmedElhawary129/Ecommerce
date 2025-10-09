# E‑commerce Application (NestJS · MongoDB · GraphQL)

Production‑ready backend for an **e‑commerce** platform, built with **NestJS (TypeScript)** and **MongoDB (Mongoose)**. Exposes **REST controllers** for core resources and a **GraphQL** endpoint (generated schema), supports **file uploads** with **Multer + Cloudinary**, and includes strong **auth/guards**, **validation**, and **repository** abstractions.

![Node](https://img.shields.io/badge/Node-22%2B-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-16.x-E10098?logo=graphql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Uploads-Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Table of Contents
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
  - [Build & Run in Production](#build--run-in-production)
- [API Overview](#api-overview)
  - [Authentication](#authentication)
  - [Catalog](#catalog)
  - [Cart & Checkout](#cart--checkout)
  - [Orders](#orders)
  - [GraphQL](#graphql)
  - [Pagination](#pagination)
  - [Error Format](#error-format)
- [Security & Hardening](#security--hardening)
- [Conventions](#conventions)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [CI](#ci)
- [License](#license)

---

## Features
- **Authentication & Authorization**
  - Access/refresh **JWT** with separate signatures
  - Role‑based guards and custom decorators (auth, role, current user)
  - Password hashing and data encryption helpers
- **Catalog**
  - **Brands**, **Categories**, **Sub‑Categories**, **Products** (with media)
  - Server‑side filtering, sorting, and query DTOs
- **Cart & Coupons**
  - Cart CRUD, coupon creation/redemption, discounts and totals
- **Orders & Payments**
  - Order creation/status lifecycle
  - **Stripe** server integration ready via `STRIPE_SECRET_KEY`
  - Email notifications (via Nodemailer)
- **Uploads**
  - **Multer** adapters and **Cloudinary** integration for images
- **DX & Safety**
  - Modular NestJS design with repository layer
  - Centralized error handling and consistent response shape
  - **GraphQL** schema (`schema.gql`) + resolvers for typed/aggregate queries

> The repository contains both TypeScript source (`src/`) and compiled JavaScript output (`dist/`).

---

## Architecture Overview
- **`main.ts`**: Nest application bootstrap (NestFactory), global pipes/filters, and module wiring.
- **`app.module.ts`**: Root module importing feature modules and global providers.
- **Database (`src/DB/`)**
  - **Models**: `user`, `product`, `order`, `cart`, `brand`, `category`, `subCategory`, `coupon`, `otp`
  - **Repository layer**: generic `DataBase.Repository` plus per‑entity repositories
- **Common (`src/common/`)**
  - **Security**: hashing & encryption utilities
  - **Guards**: authentication / authorization
  - **Decorators**: auth / role / user decorators
  - **Services**: token, file upload, email
  - **Cloudinary** adapters & configuration
  - **Utils**: filter/query DTOs, multer adapters
- **GraphQL (`src/graphql/`)**
  - GraphQL config, types, and resolvers (orders ready‑made)
- **Feature Modules (`src/modules/`)**
  - `users`, `brands`, `categories`, `subCategories`, `products`, `carts`, `coupons`, `orders`

---

## Tech Stack
- **Runtime**: Node.js (TypeScript)
- **Framework**: NestJS
- **Database**: MongoDB (Mongoose)
- **API**: REST controllers + GraphQL schema/resolvers
- **Auth**: JWT (access/refresh), bcrypt hashing, guards/decorators
- **Uploads**: Multer + Cloudinary
- **Payments**: Stripe
- **Email**: Nodemailer
- **Tooling**: Nest CLI, ESLint

---

## Project Structure
```
Ecommerce/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ graphql/
│  │  ├─ graphql.config.ts
│  │  ├─ resolver/
│  │  │  └─ order.resolver.ts
│  │  └─ types/
│  │     └─ order.types.ts
│  ├─ DB/
│  │  └─ models/
│  │     ├─ brand.model.ts
│  │     ├─ cart.model.ts
│  │     ├─ category.model.ts
│  │     ├─ coupon.model.ts
│  │     ├─ order.model.ts
│  │     ├─ otp.model.ts
│  │     ├─ product.model.ts
│  │     ├─ subcategory.model.ts
│  │     └─ user.model.ts
│  ├─ common/
│  │  ├─ cloudinary/
│  │  ├─ constants/
│  │  ├─ decorator/
│  │  ├─ guards/
│  │  ├─ security/
│  │  ├─ service/
│  │  └─ utils/
│  └─ modules/
│     ├─ brands/
│     ├─ categories/
│     ├─ subCategories/
│     ├─ products/
│     ├─ users/
│     ├─ carts/
│     ├─ coupons/
│     └─ orders/
├─ test/
├─ Ecommerce.postman_collection.json
├─ nest-cli.json
├─ tsconfig.json
├─ tsconfig.build.json
├─ eslint.config.mjs
├─ .prettierrc
├─ .gitignore
├─ schema.gql
├─ srschema.gql
└─ package.json
```

> The `dist/` directory is generated — keep source of truth in `src/` and commit JS output only if your deployment requires it.

---

## Getting Started

### Prerequisites
- **Node.js** v22+ (LTS recommended)
- **MongoDB** 6.x+ (local or Atlas)
- **Cloudinary** account for media & **SMTP** (e.g., Gmail App Password) for emails
- **Stripe** secret key (if payments are enabled)

### Installation
```bash
npm install

# Copy env template and fill in your values
cp config/.env.example .env
```

### Environment Variables
Create `.env` with the following keys (see `config/.env.example` for the complete list):

```dotenv
# Server
PORT=3000

# Database
DB_URL=mongodb://localhost:27017/ecommerce

# JWT / Security
ACCESS_TOKEN_SIGNATURE=change_me
REFRESH_TOKEN_SIGNATURE=change_me
SALT_ROUNDS=12
ENCRYPT_SECRET=change_me

# Cloudinary
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=ecommerce

# Email (Nodemailer)
EMAIL=you@example.com
PASSWORD=your_app_password

# Payments (Stripe)
STRIPE_SECRET_KEY=Stripe_Key
```

> **Do not commit secrets.** Use a secret manager for production.

### Run Locally
```bash
# Development (watch mode)
npm run start:dev

# Standard start (after compilation)
npm run start
```

### Build & Run in Production
```bash
npm run build
npm run start:prod
```
Recommended production settings:
- Restrict **CORS** to trusted origins
- Add `helmet` and HTTP compression
- Run under a process manager (PM2/systemd/Docker) with health checks
- Use MongoDB Atlas (backups, monitoring)

---

## API Overview

This backend exposes **REST** controllers for core resources and **GraphQL** for typed queries/aggregations.

### Authentication
- Sign‑up / Sign‑in with access/refresh tokens
- Token refresh, change/reset password, OTP flows (email‑based)
- Role‑based guards (`admin`, `user`)

### Catalog
- **Brands**, **Categories**, **Sub‑Categories**, **Products**
- Create/Update/Delete, list with filtering/sorting
- Media uploads via Multer → Cloudinary

### Cart & Checkout
- Add/remove/update cart items
- Apply coupons and compute totals

### Orders
- Create orders from cart, update status, list user orders
- Email notifications and optional Stripe charge flow

### GraphQL
- Endpoint: `POST /graphql` (dev playground as configured)
- Generated schema at the repo root: `schema.gql`
- Example resolvers and types provided (orders domain)

### Pagination
Common query params: `page`, `limit`, `sort`  
Typical response:
```json
{
  "items": [/* documents */],
  "total": 123,
  "page": 2,
  "pages": 13
}
```

### Error Format
Unified JSON shape for errors:
```json
{
  "status": "error",
  "message": "Human‑readable message",
  "code": "OPTIONAL_ERROR_CODE",
  "details": {}
}
```

---

## Security & Hardening
- **CORS**: allow‑list trusted origins in production
- **Rate Limiting**: tighten limits on auth/upload endpoints
- **JWT**: separate secrets for access/refresh; enforce expirations; rotation strategy
- **Uploads**: validate MIME types; organize Cloudinary folders per entity/user
- **Indexes**: ensure email uniqueness; add useful indexes (createdAt, FKs)

---

## Conventions
- **Code Style**: ESLint + Prettier
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, …)
- **HTTP**: resource‑oriented routes; use `PATCH` for partial updates
- **Validation**: DTOs/pipes for input validation

---

## Testing
The repo includes a Nest E2E scaffold under `test/`. Suggested additions:
- Unit tests for services/guards
- Integration tests for auth → catalog → cart → orders

```bash
npm run test
npm run test:e2e
```

---

## Troubleshooting
- **MongoDB**: verify `DB_URL` and Atlas IP allow‑list
- **JWT**: confirm prefixes/expiry/secrets; clear invalid tokens
- **Uploads**: check Cloudinary credentials and multer limits
- **Emails**: use an SMTP provider or Gmail App Password
- **GraphQL**: ensure schema is generated and module enabled

---

## Roadmap
- [ ] Product reviews & ratings
- [ ] Inventory & stock reservations
- [ ] Admin dashboards & reports
- [ ] Realtime notifications (orders/cart)
- [ ] Full test coverage & load testing

---

## CI
Add a GitHub Actions workflow that runs:
- `npm ci`
- build (optional)
- lint
- unit & e2e tests

Trigger on `push` and `pull_request` to `main`.

---

## License
Released under the **MIT License**. See [LICENSE](LICENSE) for details.
