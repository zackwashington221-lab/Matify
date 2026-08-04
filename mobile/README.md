# Martify Mobile — React Native (Expo)

Martify is the customer app. Its RTK Query feature slices connect to the same
Express API as the admin panel (`server/`):

- `Auth` → `/auth`
- `Catalog` → `/storefront`
- `Customer` → `/mobile`
- `Orders` → `/orders`
- `Notification` → `/notifications`

Authentication is sent automatically as a Bearer token by the shared base query.
npm ls expo react react-native

```bash
cd mobile
npm install
npx expo start          # press i / a, or scan the QR code
```

For a physical device or deployed API, copy `.env.example` to `.env` and set
`EXPO_PUBLIC_API_URL` (including the `/api` suffix). The `app.json` URL remains
the fallback for local simulators. Use your LAN IP for a physical device, for
example `http://192.168.1.20:4000/api`.

## Demo data

Set `expo.extra.useMockData` to `true` in `app.json` to run Martify without a
backend. Every RTK Query slice has a matching in-memory mock implementation,
including authentication, catalog, customer data, checkout, and notifications.

## Structure

```
mobile/
├─ App.tsx                     providers + navigation
├─ src/theme.ts                Warm Sand + Sage tokens (mirrors the web design system)
├─ src/api/client.ts           typed fetch client for /api
├─ src/context/                AuthContext (JWT + AsyncStorage), CartContext
├─ src/components/ui.tsx       Card, Button, Chip, Badge, Screen
├─ src/navigation/             bottom tabs + modal stack
└─ src/screens/                Home, Search, Product, Cart, Checkout, Orders, Profile, Login
```

## Porting web screens to native

The web admin/customer screens map 1:1 onto these primitives:

| Web                  | Native                                                 |
| -------------------- | ------------------------------------------------------ |
| `div` / `section`    | `View`                                                 |
| `p`, `span`, `h1`    | `Text` (styles from `src/theme.ts`)                    |
| Tailwind classes     | `StyleSheet` objects using `colors`/`spacing`/`radius` |
| `button`             | `Pressable` / `Button` from `components/ui`            |
| `<Link to>` / router | `navigation.navigate(...)`                             |
| scroll container     | `ScrollView` / `FlatList`                              |

Keep business logic in `src/api/client.ts` and the contexts — only the
presentation layer differs between web and native.
