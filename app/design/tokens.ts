// Design tokens — "Ink & Paper" theme.
// Every screen should read colors/spacing/type from here, never hardcode hex.

export const lightTokens = {
  color: {
    paper: "#F7F5F1",
    surface: "#FFFFFF",
    surfaceSunken: "#EFECE6",
    hairline: "#E3DED4",
    hairlineStrong: "#D6CFC2",

    ink: "#1A1917",
    inkMuted: "#6B655C",
    inkFaint: "#9C958A",

    crimson: "#C0362C",
    crimsonSoft: "#F5E4E1",
    inverse: "#FFFFFF",

    success: "#3F7D5C",
    successSoft: "#E1EEE7",
    warning: "#B8862F",
    warningSoft: "#F3E9D6",
    info: "#3A6B8A",
    infoSoft: "#E1EAEF",
    danger: "#B23120",
    dangerSoft: "#F5E1DE",

    badge: {
      BRONZE: "#A56A3A",
      SILVER: "#8E9196",
      GOLD: "#C08A2E",
      PLATINUM: "#5E7E8C",
      DIAMOND: "#6C63B5",
    },
  },
  type: {
    display: { fontSize: 40, fontWeight: "300" as const, letterSpacing: -1.2, lineHeight: 46 },
    h1: { fontSize: 28, fontWeight: "600" as const, letterSpacing: -0.6, lineHeight: 34 },
    h2: { fontSize: 20, fontWeight: "600" as const, letterSpacing: -0.3, lineHeight: 26 },
    h3: { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.2, lineHeight: 22 },
    body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
    bodyBold: { fontSize: 15, fontWeight: "600" as const, lineHeight: 22 },
    label: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },
    caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
    overline: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.8, lineHeight: 14 },
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40, massive: 56 },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 },
  stroke: 1.75,
} as const;

export type Tokens = typeof lightTokens;

// Dark theme stub — not shipped yet. Adding dark mode later means filling this
// map in and wiring ThemeProvider's colorScheme switch; no screen changes needed.
export const darkTokens: Tokens = lightTokens;

export type BadgeTier = keyof Tokens["color"]["badge"];
