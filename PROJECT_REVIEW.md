# Martify Project Review

## 1. Purpose and scope

Martify is a grocery-commerce platform with three independently runnable applications that share one Express and MongoDB API:

| Area | Location | Main users | Responsibility |
| --- | --- | --- | --- |
| Web | `web/` | Store customers and operations staff | Customer storefront plus the browser-based admin console |
| Mobile | `mobile/` | Store customers | Native Expo/React Native customer experience |
| API | `server/` | Both clients | Authentication, business data, permissions, audit log, notifications, and AI shopper services |

The project is already structured as a small monorepo. Each application has its own `package.json` and must be installed and started from its own directory.

## 2. Architecture at a glance

```text
                   +---------------------+
                   |  MongoDB database   |
                   +----------+----------+
                              ^
                              |
                  Mongoose models and queries
                              |
                   +----------+----------+
                   | Express API (`server`)|
                   | /api + JWT + roles   |
                   +-----+-----------+----+
                         |           |
                Bearer JWT           Bearer JWT
                         |           |
      +------------------+--+     +--+------------------+
      | Web (`web`)         |     | Mobile (`mobile`)    |
      | React/TanStack      |     | Expo/React Native    |
      | Admin + storefront  |     | Customer application |
      +---------------------+     +----------------------+
```

### Primary technologies

- **Web:** React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS, Radix UI, React Query.
- **Mobile:** Expo 57, React Native 0.86, TypeScript, Redux Toolkit, RTK Query, React Navigation, Redux Persist.
- **Server:** Node.js ESM, Express, MongoDB/Mongoose, JWT, bcrypt, Zod, Helmet, CORS, rate limiting, Resend, and Gemini integration.

## 3. Web application review

### What is implemented

- Public/storefront routes for browsing, search, products, cart, checkout, tracking, profile, and an AI assistant.
- A comprehensive `/admin` area for orders, products, inventory, customers, promotions, banners, notifications, analytics, reports, roles, team management, settings, and profile management.
- A typed API client in `web/src/lib/api-client.ts` that stores the admin JWT and profile in browser local storage and attaches the JWT to API requests.
- Shared, reusable UI primitives under `web/src/components/ui` and admin layout primitives under `web/src/components/admin`.
- An admin-profile **Create admin** dialog. Owners and Admins can submit an email and temporary password; the API creates an active Admin account.

### Current behavior to understand

- The app defaults to the deployed Railway API, `https://matify.up.railway.app/api`, when `VITE_API_URL` is not supplied.
- Several pages still import mock data from `web/src/lib/admin-mock.ts` or `web/src/lib/mock-data.ts`. This means the visual interface may display demonstration data even when a real API is configured. The typed API client is ready for screens to migrate to live data incrementally.
- `npm --prefix web run build` succeeds and produces a Cloudflare-oriented Nitro build in `web/.output/`.

### Suggested web next steps

1. Add a `web/.env.example` documenting `VITE_API_URL`.
2. Replace mock-driven admin screens with API queries, prioritizing orders, products, inventory, and customers.
3. Add route-level tests for login, admin authorization, and the Create admin dialog.
4. Define a production session strategy. Local-storage JWTs are straightforward but need careful XSS protection and token-expiry handling.

## 4. Mobile application review

### What is implemented

- Customer authentication, onboarding, catalogue, product details, cart, checkout, orders, tracking, profile, addresses, payment methods, notifications, wishlist, and an AI assistant.
- A Redux store with persisted session/cart/general state and RTK Query feature APIs for Auth, Catalog, Customer, Orders, Notifications, and Assistant.
- Separate screen view and controller-hook files, which keeps rendering logic and request/state logic reasonably isolated.
- A mock-data mode controlled by application configuration, useful for UI development without a running API.

### Configuration

- `EXPO_PUBLIC_API_URL` must include the `/api` suffix.
- A physical device must use a reachable LAN or deployed URL; `localhost` will not refer to the development computer from a phone.
- The mobile login automatically adds the saved Bearer token through `baseQuery.ts`.

### Suggested mobile next steps

1. Validate every RTK Query endpoint and response type against the Express API; this is especially important while mock mode is available.
2. Add device/simulator smoke tests for login, checkout, and order history.
3. Move credentials/tokens to the strongest suitable secure-storage mechanism for the target platform and document the decision.

## 5. Server and data review

### API design

All server endpoints sit under `/api`. The main route groups are:

| Domain | Examples |
| --- | --- |
| Identity | `/auth/signup`, `/auth/login`, `/auth/me`, `/auth/change-password` |
| Storefront | `/storefront/categories`, `/storefront/products`, `/storefront/banners` |
| Commerce | `/products`, `/inventory`, `/orders`, `/returns`, `/customers` |
| Operations | `/promotions`, `/banners`, `/notifications`, `/reports`, `/analytics` |
| Administration | `/team`, `/roles`, `/api-keys`, `/integrations`, `/settings`, `/audit` |
| AI | `/ai/shopper`, `/ai/agents`, `/ai/runs` |

List endpoints use pagination and return `data`, `page`, `limit`, `total`, and `pages`. The generic CRUD router also records create, update, and delete actions in the audit log.

### Authentication and permissions

- Passwords are stored as bcrypt hashes; passwords are never returned by the API.
- Login issues a JWT with user ID, email, and role claims.
- The standard role set is: Owner, Admin, Ops Manager, Support, Analyst, Read only, and Customer.
- Authenticated admin reads use `requireAdmin`; most writes use `requireWriteAdmin` (Owner, Admin, or Ops Manager).
- Team management and the new `POST /api/team/admins` endpoint are restricted to Owner and Admin roles.
- The Create admin endpoint validates email and an eight-character minimum password, rejects duplicates, hashes the password, and adds an audit-log entry.

### Main data entities

The Mongoose model layer covers users/roles, API keys, integrations, audit logs, catalogue categories/products, inventory and stock movements, customers, orders, returns, promotions, banners, notifications/device tokens, AI agents/runs, scheduled reports, and settings.

### Seed data

| Command | Effect |
| --- | --- |
| `npm run seed` | Loads demo data only if the database is empty. It will not overwrite data. |
| `npm run seed:reset` | Deletes the demo collections and reloads them. Use only when a full replacement is intended. |
| `npm run seed:admin` | Upserts only `haris@martify.com` as an active Admin. It does not reseed other data. |

The separate admin seed currently contains its credential in source code. Before a production release, supply that password through an environment variable or a protected one-time setup process, then remove/rotate the initial credential.

## 6. Local development guide

### Prerequisites

- Node.js and npm
- MongoDB (local instance or hosted deployment)
- A strong JWT secret

### Start the API

```sh
cd server
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm install
npm run seed            # only for an empty development database
npm run dev
```

The API listens on `http://localhost:4000/api` unless `PORT` changes.

### Start the web app

```sh
cd web
npm install
VITE_API_URL=http://localhost:4000/api npm run dev
```

### Start the mobile app

```sh
cd mobile
cp .env.example .env
# The default is https://matify.up.railway.app/api; override it only when needed.
npm install
npm run start
```

## 7. Delivery and quality assessment

### Strengths

- Clear separation of web, mobile, and API code.
- Broad feature coverage for a grocery-commerce MVP.
- Central Mongoose models and generic CRUD support reduce duplicated backend code.
- JWT and role middleware are consistently available to protected routes.
- Audit logs exist for server-side mutations.
- Both clients have a practical development path through mock data and seeded data.

### Risks and gaps to address before production

| Priority | Finding | Recommendation |
| --- | --- | --- |
| Medium | The API intentionally accepts requests from every origin. | Keep this only while an open API is required; restrict origins before handling browser cookie sessions or sensitive cross-origin workflows. |
| High | The admin seed keeps a known password in the repository. | Use a secret environment variable or one-time provisioning, then rotate the password. |
| High | There are no automated test scripts or test suites visible in the package manifests. | Add API integration tests and web/mobile smoke tests for authentication, permissions, checkout, and admin creation. |
| Medium | Repository-wide web lint currently reports many pre-existing Prettier errors. | Establish a formatting baseline and add lint/build checks to CI after the baseline is clean. |
| Medium | The web console mixes real API infrastructure with mock-backed screens. | Track the migration by screen and avoid deploying a misleading mixture of live and static data. |
| Medium | API rate limiting is global and simple. | Add per-sensitive-route limits (login, signup, password changes) and monitoring. |
| Medium | Generic CRUD routes accept request bodies directly. | Introduce route-level Zod schemas/allowlists for each resource before exposing production admin access. |
| Low | Product naming and documentation are inconsistent: Martify/Martify, Martify, and Graspra remain in different files. | Complete a single branding and documentation pass. |

## 8. Documentation status

This review reflects the code currently in the repository. Existing documents that need revision are:

- `web/README.md` still reads as a generic Lovable template and describes the former root-level web layout.
- `server/README.md` uses the previous Martify name and does not yet list the dedicated admin creation endpoint or separate admin seed.
- `mobile/structure.md` and `mobile/service.md` describe a different, older Graspra architecture and file tree. They should not be used as the authoritative guide for the present mobile source.

## 9. Recommended delivery order

1. Finish the Martify brand and documentation cleanup.
2. Secure configuration: strong JWT secret, deployment-specific environment variables, and removal of source-controlled initial passwords.
3. Connect the most important web admin screens to live APIs.
4. Add test coverage and CI gates for build, formatting, and key authorization flows.
5. Add operational monitoring, backup/recovery procedures, and release documentation before public launch.
