/**
 * Theme Configuration
 * Constants and utilities for theme management
 * Similar to your React Native theme structure
 */

export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

/**
 * Theme configuration object
 * Use this to access theme values programmatically if needed
 */
export const themeConfig = {
  default: "dark" as Theme,

  colors: {
    dark: {
      primary: "#1a8754", // Racing green
      secondary: "#38bdf8", // Electric blue
      accent: "#facc15", // Amber
      background: "#020617", // Deep slate
      text: "#e2e8f0", // Light gray
    },
    light: {
      primary: "#15803d", // Racing green (adjusted)
      secondary: "#0369a1", // Electric blue (darker)
      accent: "#b45309", // Amber (darker)
      background: "#ffffff", // White
      text: "#0f172a", // Dark slate
    },
  },

  fonts: {
    brand: "'Space Grotesk', 'Racing Sans One', sans-serif",
    body: "'Inter', 'Roboto', 'Segoe UI', sans-serif",
  },

  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1200px",
  },
} as const;

/**
 * Get the user's preferred theme
 * Checks localStorage first, then system preference, then default
 */
export function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return themeConfig.default;
  }

  // Check localStorage
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  // Default
  return themeConfig.default;
}

/**
 * Apply theme to the document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
