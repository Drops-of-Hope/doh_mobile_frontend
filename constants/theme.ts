// UI Color Constants
export const COLORS = {
  // Primary colors
  PRIMARY: "#dc2626", // red-600
  PRIMARY_LIGHT: "#ef4444", // red-500
  PRIMARY_DARK: "#b91c1c", // red-700

  // Secondary colors
  SECONDARY: "#6b7280", // gray-500
  SECONDARY_LIGHT: "#9ca3af", // gray-400
  SECONDARY_DARK: "#374151", // gray-700

  // Background colors
  BACKGROUND: "#ffffff",
  BACKGROUND_SECONDARY: "#f9fafb", // gray-50
  BACKGROUND_TERTIARY: "#f3f4f6", // gray-100

  // Text colors
  TEXT_PRIMARY: "#111827", // gray-900
  TEXT_SECONDARY: "#6b7280", // gray-500
  TEXT_MUTED: "#9ca3af", // gray-400

  // Border colors
  BORDER: "#e5e7eb", // gray-200
  BORDER_LIGHT: "#f3f4f6", // gray-100

  // State colors
  SUCCESS: "#10b981", // emerald-500
  WARNING: "#f59e0b", // amber-500
  ERROR: "#ef4444", // red-500
  INFO: "#3b82f6", // blue-500
} as const;

// Tab Bar Specific Colors
export const TAB_COLORS = {
  ACTIVE: COLORS.PRIMARY,
  INACTIVE: COLORS.TEXT_SECONDARY,
  BACKGROUND: COLORS.BACKGROUND,
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
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  FULL: 9999,
} as const;
