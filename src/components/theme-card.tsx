import { ThemePreset } from "../types/theme";
import { Card } from "./ui/card";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useThemeStore } from "../stores/theme-store";

interface ThemeCardProps {
  themeKey: string;
  theme: ThemePreset;
  className?: string;
}

type SwatchDefinition = {
  name: string;
  bgKey: keyof ThemePreset["styles"]["light" | "dark"];
  fgKey: keyof ThemePreset["styles"]["light" | "dark"];
};

const swatchDefinitions: SwatchDefinition[] = [
  { name: "Primary", bgKey: "primary", fgKey: "primary-foreground" },
  { name: "Secondary", bgKey: "secondary", fgKey: "secondary-foreground" },
  { name: "Accent", bgKey: "accent", fgKey: "accent-foreground" },
  { name: "Muted", bgKey: "muted", fgKey: "muted-foreground" },
  { name: "Background", bgKey: "background", fgKey: "foreground" },
];

export function ThemeCard({ themeKey, theme, className }: ThemeCardProps) {
  const { themeState, setThemeState } = useThemeStore();
  const mode = themeState.currentMode;

  const handleApplyTheme = () => {
    setThemeState({
      ...themeState,
      preset: themeKey,
      styles: {
        light: { ...theme.styles.light } as any,
        dark: { ...theme.styles.dark } as any,
      },
    });
  };

  const colorSwatches = swatchDefinitions.map((def) => ({
    name: def.name,
    bg: theme.styles[mode][def.bgKey] || "#ffffff",
    fg: theme.styles[mode][def.fgKey] || theme.styles[mode].foreground || "#000000",
  }));

  return (
    <Card
      className={cn(
        "group overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="relative flex h-24">
        {colorSwatches.map((swatch) => (
          <div
            key={swatch.name + swatch.bg}
            className={cn(
              "group/swatch relative h-full flex-1 transition-all duration-300 ease-in-out",
              "hover:flex-grow-[1.5]"
            )}
            style={{ backgroundColor: swatch.bg }}
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 group-hover/swatch:opacity-100",
                "transition-opacity duration-300 ease-in-out",
                "pointer-events-none text-xs font-medium"
              )}
              style={{ color: swatch.fg }}
            >
              {swatch.name}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-3">
        <div>
          <h3 className="text-sm font-medium">{theme.label || themeKey}</h3>
          {theme.createdAt && (
            <p className="text-xs text-muted-foreground">
              {theme.createdAt}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant={themeState.preset === themeKey ? "default" : "outline"}
          onClick={handleApplyTheme}
        >
          {themeState.preset === themeKey ? "Applied" : "Apply"}
        </Button>
      </div>
    </Card>
  );
}