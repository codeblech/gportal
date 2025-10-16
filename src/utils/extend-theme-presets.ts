import type { ThemePreset, ThemeStyleProps } from "../types/theme";

// Default values for custom JPortal variables based on the current CSS
const getCustomVariableDefaults = (mode: "light" | "dark"): Partial<ThemeStyleProps> => {
  if (mode === "light") {
    return {
      // Custom variables from your index.css :root
      "destructive2": "hsl(0 84.2% 60.2%)",
      "day-selected": "hsl(217.2 32.6% 17.5%)",
      "active": "hsl(217.2 32.6% 17.5%)",
      "active2": "hsla(217.2 32.6% 17.5% / 0.5)",

      // Extended accent colors
      "accent2": "hsl(217.2 32.6% 17.5%)",
      "accent3": "hsl(215 20.2% 65.1%)",
      "accent4": "hsl(210 40% 98%)",
      "accent5": "hsl(142 76% 36%)",
      "accent6": "hsl(215 20.2% 65.1%)",
      "accent7": "hsl(217.2 32.6% 17.5%)",
      "accent8": "hsl(215 20.2% 65.1%)",
      "accent9": "hsl(210 40% 98%)",
      "accent10": "hsla(210 40% 98% / 0.8)",

      // Ring variations
      "ring-hover": "hsl(210 40% 90%)",

      // Calendar colors
      "calendar-positive": "hsla(142 76% 36% / 0.3)",
      "calendar-negative": "hsla(0 84.2% 60.2% / 0.3)",
      "calendar-positive2": "hsla(142 76% 36% / 0.2)",
      "calendar-negative2": "hsla(0 84.2% 60.2% / 0.2)",

      // Border variations
      "border-subtle": "hsla(210 40% 98% / 0.1)",

      // Grade colors
      "grade-aa": "hsl(142 76% 36%)",
      "grade-a": "hsl(120 60% 50%)",
      "grade-bb": "hsl(60 90% 60%)",
      "grade-b": "hsl(45 90% 60%)",
      "grade-cc": "hsl(35 90% 60%)",
      "grade-c": "hsl(25 90% 60%)",
      "grade-d": "hsl(15 90% 60%)",
      "grade-f": "hsl(0 84.2% 60.2%)",

      // Marks colors
      "marks-outstanding": "hsl(142 76% 36%)",
      "marks-good": "hsl(45 90% 60%)",
      "marks-average": "hsl(25 90% 60%)",
      "marks-poor": "hsl(0 84.2% 60.2%)",

      // Standard variables that might be missing
      "shadow-color": "hsl(0 0% 0%)",
      "shadow-opacity": "0.1",
      "shadow-blur": "3px",
      "shadow-spread": "0px",
      "shadow-offset-x": "0",
      "shadow-offset-y": "1px",
      "letter-spacing": "0em",
      "spacing": "0.25rem",
    };
  } else {
    return {
      // Custom variables from your index.css .dark
      "destructive2": "hsl(359 100% 69.6%)",
      "day-selected": "hsl(0 8.7% 20.2%)",
      "active": "hsl(215 27.9% 16.9%)",
      "active2": "hsla(216 31% 17.1% / 0.5)",

      // Extended accent colors
      "accent2": "hsl(216.9 19.1% 26.7%)",
      "accent3": "hsl(220, 33%, 38%)",
      "accent4": "hsl(258 13.6% 84.1%)",
      "accent5": "hsl(141.9 69.2% 58%)",
      "accent6": "hsl(220 8.9% 46.1%)",
      "accent7": "hsl(216 15.4% 34.3%)",
      "accent8": "hsl(217.9 10.6% 64.9%)",
      "accent9": "hsl(265 13% 91%)",
      "accent10": "hsla(213 93.9% 67.8% / 0.8)",

      // Ring variations
      "ring-hover": "var(--color-blue-300)",

      // Calendar colors
      "calendar-positive": "hsla(142 100% 32.5% / 0.4)",
      "calendar-negative": "hsla(357 100% 45.3% / 0.4)",
      "calendar-positive2": "hsla(141 76.2% 36.3% / 0.4)",
      "calendar-negative2": "hsla(0 72.2% 50.6% / 0.4)",

      // Border variations
      "border-subtle": "hsla(0 0% 100% / 0.1)",

      // Grade colors
      "grade-aa": "hsl(150 95.6% 44.7%)",
      "grade-a": "hsl(144 100% 39.4%)",
      "grade-bb": "hsl(47 100% 49.6%)",
      "grade-b": "hsl(44 100% 47.1%)",
      "grade-cc": "hsl(39 100% 40.8%)",
      "grade-c": "hsl(32 100% 50.8%)",
      "grade-d": "hsl(25 100% 50%)",
      "grade-f": "hsl(0 84.2% 60.2%)",

      // Marks colors
      "marks-outstanding": "hsl(144 100% 39.4%)",
      "marks-good": "hsl(44 100% 47.1%)",
      "marks-average": "hsl(25 100% 50%)",
      "marks-poor": "hsl(0 84.2% 60.2%)",

      // Standard variables that might be missing
      "shadow-color": "hsl(0 0% 0%)",
      "shadow-opacity": "0.1",
      "shadow-blur": "3px",
      "shadow-spread": "0px",
      "shadow-offset-x": "0",
      "shadow-offset-y": "1px",
      "letter-spacing": "0em",
      "spacing": "0.25rem",
    };
  }
};

// Function to extend a theme preset with custom variables
export const extendThemePreset = (preset: ThemePreset): ThemePreset => {
  return {
    ...preset,
    styles: {
      light: {
        ...getCustomVariableDefaults("light"),
        ...preset.styles.light,
      },
      dark: {
        ...getCustomVariableDefaults("dark"),
        ...preset.styles.dark,
      },
    },
  };
};

// Function to extend all theme presets
export const extendAllThemePresets = (presets: Record<string, ThemePreset>): Record<string, ThemePreset> => {
  const extendedPresets: Record<string, ThemePreset> = {};

  for (const [key, preset] of Object.entries(presets)) {
    extendedPresets[key] = extendThemePreset(preset);
  }

  return extendedPresets;
};