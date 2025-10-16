import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("cursor-pointer rounded-full", className)}
      {...props}
      onClick={handleThemeToggle}
    >
      {theme === "light" ?
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> :
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      }
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}