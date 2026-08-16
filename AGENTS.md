<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Codex agent guide

## Project overview

Martify is an AI-assisted grocery-commerce product with three applications:

- `web/` — TanStack Start storefront and administration portal.
- `mobile/` — Expo/React Native customer app.
- `server/` — Express and MongoDB API shared by the web and mobile clients.

Codex should preserve the existing architecture, make focused changes in the
appropriate application, and keep the web, mobile, and API contracts aligned.
Do not expose API keys, credentials, customer data, or payment data in client
code or committed files.

## Working conventions

- Inspect the affected client and the corresponding server route/model before
  changing an API-backed feature.
- Prefer existing API clients, Redux slices, and shared types in `mobile/`, and
  the existing API/storefront helpers in `web/`.
- Validate user input at the API boundary with the project’s established Zod
  patterns. Keep authorization checks on the server.
- Keep authentication, cart, checkout, order, and AI-assistant flows resilient:
  present loading, empty, and error states, and do not silently fall back to
  invented live data.
- For AI shopping recommendations, use current catalog, inventory, price, and
  customer context. Clearly separate unavailable/unknown information from
  actual recommendations.
- Use the package-local commands when verification is needed:
  `cd web && npm run lint`, `cd web && npm run build`, and
  `cd mobile && npm run typecheck`. Start the API with
  `cd server && npm run dev`.
- Never rewrite published Git history. Keep the connected Lovable branch in a
  working state, as described above.

## Project work completed by the agent team

The following functionality is present in this repository and should be
preserved and extended rather than recreated:

- Built the mobile application UI and its customer experience, including
  onboarding, sign-up/sign-in, session handling, catalog browsing, cart, and
  account-related screens.
- Established the web storefront and a web administration experience for
  products, inventory, orders, customers, promotions, banners, analytics,
  reports, notifications, roles, teams, and settings.
- Created the Express/MongoDB backend with authentication, storefront,
  inventory, orders, analytics, notification, team, mobile, and AI-shopper
  routes.
- Seeded and connected a complete 100-product catalog, then moved homepage and
  storefront content onto live API data.
- Connected the mobile and web AI shopping assistants to the live shopper API,
  restricted the assistant to Martify shopping questions, added catalog
  fallback handling, and required live AI responses for shopping advice.
- Improved budget-aware shopping conversations, including support for healthy
  dinner baskets and conversational budget changes.
- Added persistent chat history and customer carts, customer-profile API
  integration, and typed mobile cart synchronization.
- Added customer-session requirements for web AI, removed unsupported
  third-party customer login options, and connected profile data to live
  account data.
- Improved checkout with signed-in customer autofill and persisted details,
  cash on delivery, web checkout-to-order API integration, delivery-time
  messaging, and live order tracking.
- Added deployment support for GitHub Pages, configured the deployed API/admin
  management path, enabled GitHub Actions on Node 24, and created the current
  favicon.
