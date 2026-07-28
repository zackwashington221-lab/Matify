# Freshly Mobile — React Native (Expo)

Separate Expo app for customers. It talks to the same backend as the admin panel
(`server/`), so nothing is duplicated between the two clients.
npm ls expo react react-native

```bash
cd mobile
npm install
npx expo start          # press i / a, or scan the QR code
```

Point the app at your API in `app.json` → `expo.extra.apiUrl`
(use your LAN IP for a physical device, e.g. `http://192.168.1.20:4000/api`).

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
