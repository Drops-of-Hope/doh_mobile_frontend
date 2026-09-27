// UI Color Constants — legacy token file.
//
// The canonical design system now lives in app/design/tokens.ts ("Ink & Paper").
// This file remains only for components that haven't been migrated to
// useTheme() yet; its values are aligned to the same palette so legacy-styled
// components harmonize with rebuilt screens. Prefer app/design for new code.
export const COLORS = {
  // Primary colors
  PRIMARY: "#C0362C", // crimson
  PRIMARY_LIGHT: "#D4574E",
  PRIMARY_DARK: "#9C2B23",

  // Secondary colors
  SECONDARY: "#6B655C", // ink muted
  SECONDARY_LIGHT: "#9C958A", // ink faint
  SECONDARY_DARK: "#3E3A34",

  // Background colors
  BACKGROUND: "#FFFFFF", // surface
  BACKGROUND_SECONDARY: "#F7F5F1", // paper
  BACKGROUND_TERTIARY: "#EFECE6", // surface sunken

  // Text colors
  TEXT_PRIMARY: "#1A1917", // ink
  TEXT_SECONDARY: "#6B655C", // ink muted
  TEXT_MUTED: "#9C958A", // ink faint

  // Border colors
  BORDER: "#E3DED4", // hairline
  BORDER_LIGHT: "#EFECE6",

  // State colors
  SUCCESS: "#3F7D5C", // moss
  WARNING: "#B8862F", // ochre
  ERROR: "#B23120",
  INFO: "#3A6B8A", // slate
} as const;

// Tab Bar Specific Colors
export const TAB_COLORS = {
  ACTIVE: COLORS.PRIMARY,
  INACTIVE: COLORS.TEXT_SECONDARY,
  BACKGROUND: COLORS.BACKGROUND_SECONDARY,
  BORDER: COLORS.BORDER,
} as const;

// Common spacing values
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

// Common border radius values
export const BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  FULL: 9999,
} as const;
