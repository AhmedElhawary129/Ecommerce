# E-commerce Backend (NestJS · TypeScript · MongoDB)

[![CI](https://github.com/AhmedElhawary129/Ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/AhmedElhawary129/Ecommerce/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/Node-22%2B-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Framework-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modular, production-ready backend for an e-commerce system built with **NestJS** and **TypeScript**, using **MongoDB** via **Mongoose**.  
It exposes **REST APIs** for all core domains and provides **GraphQL** for order workflows. File uploads are supported (Multer + Cloudinary), and payments are integrated with Stripe.

---

## Features

- **Domains (modules):** brands, categories, subCategories, products, users, carts, coupons, orders.
- **APIs:** REST across all modules + **/graphql** for orders.
- **Auth & Roles:** JWT (access/refresh) and role-based guards.
- **Validation:** DTOs with class-validator/class-transformer.
- **Uploads:** Multer + Cloudinary integration.
- **Payments:** Stripe (secret key + webhook).
- **Caching:** Nest CacheInterceptor where applicable.
- **Quality:** Jest tests, ESLint, Prettier.
- **Postman:** `Ecommerce.postman_collection.json` for quick testing.

---

## Tech Stack

- **Runtime:** Node.js (v22+)
- **Framework:** NestJS (Express)
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **APIs:** REST + GraphQL (Apollo)
- **Media:** Cloudinary
- **Payments:** Stripe
- **Tooling:** Jest, ESLint, Prettier, Multer

---

## Folder Structure

```text
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

---

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Create environment file (do NOT commit real secrets)
#    Required path: ./config/.env
mkdir -p config && touch config/.env

# 3) Run in development (watch)
npm run start:dev

# 4) Build & run in production
npm run build
npm run start:prod
```

- Base URL (default): `http://localhost:3000`
- GraphQL Playground: `http://localhost:3000/graphql`

---

## Environment Variables

Create `./config/.env` (local only) and **commit a safe example** as `./config/.env.example`:

```env
# .env (local, do NOT commit)
PORT=3000
DB_URL=mongodb://localhost:27017/ecommerce
ACCESS_TOKEN_SIGNATURE=replace_me_access
REFRESH_TOKEN_SIGNATURE=replace_me_refresh
SALT_ROUNDS=10

# Optional – enable when needed
ENCRYPT_SECRET=
EMAIL=
PASSWORD=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=
STRIPE_SECRET_KEY=
```

Example to commit:
```env
# config/.env.example (safe to commit)
PORT=3000
DB_URL=mongodb://localhost:27017/ecommerce
ACCESS_TOKEN_SIGNATURE=CHANGE_ME
REFRESH_TOKEN_SIGNATURE=CHANGE_ME
SALT_ROUNDS=10
ENCRYPT_SECRET=
EMAIL=
PASSWORD=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=
STRIPE_SECRET_KEY=
```

Ensure `.gitignore` excludes real env files:
```gitignore
# Environment
config/.env
config/*.env
*.env
```

---

## NPM Scripts

```bash
npm run start:dev   # Development (watch)
npm start           # Start
npm run build       # Build TypeScript -> dist/
npm run start:prod  # Run compiled app (production)
npm run lint        # ESLint
npm run format      # Prettier
npm test            # Jest
```

---

## REST API Overview

> Base: `http://localhost:<PORT>`

### Brands
- `POST /brands/create`
- `PATCH /brands/update/:id`
- `DELETE /brands/delete/:id`
- `GET /brands`

### Categories
- `POST /categories/create`
- `PATCH /categories/update/:id`
- `DELETE /categories/delete/:id`
- `GET /categories`

### Sub-Categories
- `POST /subCategories/create`
- `PATCH /subCategories/update/:id`
- `DELETE /subCategories/delete/:id`
- `GET /subCategories`

### Products
- `POST /products/create`
- `PATCH /products/update/:productId`
- `DELETE /products/delete/:id`
- `GET /products`

### Users
- `POST /users/signUp`
- `PATCH /users/confirmEmail`
- `POST /users/signIn`
- `GET /users/profile`

### Carts
- `POST /carts/add`
- `PATCH /carts/remove`
- `PATCH /carts/update`

### Coupons
- `POST /coupons/create`
- `PATCH /coupons/update/:id`
- `DELETE /coupons/delete/:id`

### Orders
- `POST /orders/create`
- `POST /orders/payment`
- `POST /orders/webhook`
- `GET /orders/success`
- `GET /orders/cancel`
- `PATCH /orders/cancel`

---

## GraphQL

- Endpoint: `POST /graphql`
- Resolvers: orders (auto-generated schema present: `schema.gql`, `srschema.gql`)
- Example query (illustrative):
```graphql
query {
  orders {
    id
    total
    status
    userId
    items { productId quantity price }
  }
}
```

---

## Uploads & Payments

- **Uploads:** Multer + Cloudinary. Configure `CLOUDINARY_*` variables when enabling uploads.
- **Payments:** Stripe secret key via `STRIPE_SECRET_KEY`. Webhook receiver at `/orders/webhook`.

---

## Testing & Tooling

- **Testing:** Jest (unit/e2e). Sample e2e spec in `test/app.e2e-spec.ts`.
- **Code Quality:** ESLint + Prettier.
- **CLI:** `nest-cli.json` uses `src` as `sourceRoot`.
- **Postman:** `Ecommerce.postman_collection.json` at the root.

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`
2. Run lint & tests locally: `npm run lint && npm test`
3. Open a Pull Request with a clear description.

---

## License

Released under the **MIT License**. See [LICENSE](LICENSE) for details.
