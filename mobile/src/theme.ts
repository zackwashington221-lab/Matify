// Martify mobile design language — "Warm Sand + Sage", editorial and tactile.
export const colors = {
  background: "#faf8f5",
  backgroundAlt: "#f4f0e9",
  surface: "#ffffff",
  surfaceAlt: "#f0ebe3",
  surfaceSunken: "#f7f4ee",
  border: "#e7e0d5",
  borderStrong: "#d8cfc0",
  text: "#211d18",
  textSoft: "#4b4439",
  muted: "#8b8175",
  primary: "#3f5c37",
  primaryDeep: "#2c4126",
  primarySoft: "#87a878",
  primaryTint: "#e7efe1",
  accent: "#b7823a",
  accentTint: "#f6ecdc",
  danger: "#a4462f",
  dangerTint: "#f9e7e2",
  warning: "#b7823a",
  success: "#3f5c37",
  onPrimary: "#f7faf4",
  onPrimarySoft: "#d5e3c9",
  overlay: "rgba(33,29,24,0.45)",
};

export const gradients = {
  primary: ["#4a6741", "#2c4126"] as const,
  sage: ["#87a878", "#4a6741"] as const,
  sand: ["#f6ecdc", "#f0ebe3"] as const,
  glow: ["rgba(135,168,120,0.35)", "rgba(135,168,120,0)"] as const,
};

export const radius = { xs: 8, sm: 12, md: 16, lg: 22, xl: 30, xxl: 38, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 30, xxxl: 40 };

export const type = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: "800" as const, letterSpacing: -0.8, color: colors.text },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "800" as const, letterSpacing: -0.4, color: colors.text },
  subtitle: { fontSize: 17, lineHeight: 23, fontWeight: "700" as const, letterSpacing: -0.2, color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.textSoft },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "700" as const, color: colors.text },
  caption: { fontSize: 12, lineHeight: 17, color: colors.muted },
  eyebrow: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800" as const,
    letterSpacing: 1.4,
    color: colors.muted,
  },
};

export const shadow = {
  card: {
    shadowColor: "#4a3a24",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  raised: {
    shadowColor: "#33291b",
    shadowOpacity: 0.14,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  soft: {
    shadowColor: "#4a3a24",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
};

export const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;
