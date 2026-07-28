// Warm Sand + Sage design tokens — mirrors the admin panel's src/styles.css.
export const colors = {
  background: "#faf8f5",
  surface: "#ffffff",
  surfaceAlt: "#f0ebe3",
  border: "#e4ddd2",
  text: "#231f1a",
  muted: "#7c7268",
  primary: "#4a6741",
  primarySoft: "#87a878",
  primaryTint: "#e8efe3",
  danger: "#a4462f",
  warning: "#b7823a",
  success: "#4a6741",
};

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const type = {
  display: { fontSize: 28, fontWeight: "700" as const, letterSpacing: -0.6, color: colors.text },
  title: { fontSize: 20, fontWeight: "700" as const, letterSpacing: -0.3, color: colors.text },
  body: { fontSize: 15, color: colors.text },
  label: { fontSize: 13, fontWeight: "600" as const, color: colors.text },
  caption: { fontSize: 12, color: colors.muted },
};

export const shadow = {
  card: {
    shadowColor: "#5b4a35",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
};

export const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;
