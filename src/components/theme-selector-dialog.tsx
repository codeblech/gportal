import { Palette } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ThemeSelector } from "./theme-selector";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "./theme-provider";
import { useThemeStore } from "../stores/theme-store";
import { defaultPresets } from "../utils/theme-presets";
import { useRef } from "react";

export function ThemeSelectorDialog() {
  const { toggleTheme } = useTheme();
  const { themeState, setThemeState } = useThemeStore();
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasSwipedRef = useRef(false);

  // Get sorted theme keys for cycling
  const themeKeys = Object.keys(defaultPresets).sort();

  const changeToTheme = (themeKey: string) => {
    const preset = defaultPresets[themeKey];
    if (!preset) return;

    setThemeState({
      ...themeState,
      preset: themeKey,
      styles: {
        light: { ...preset.styles.light } as any,
        dark: { ...preset.styles.dark } as any,
      },
    });
  };

  const getNextTheme = () => {
    const currentIndex = themeKeys.indexOf(themeState.preset || "adefault");
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    return themeKeys[nextIndex];
  };

  const getPreviousTheme = () => {
    const currentIndex = themeKeys.indexOf(themeState.preset || "adefault");
    const prevIndex = currentIndex === 0 ? themeKeys.length - 1 : currentIndex - 1;
    return themeKeys[prevIndex];
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    isHoldingRef.current = false;
    holdTimeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      const { clientX: x, clientY: y } = event;
      toggleTheme({ x, y });
    }, 500); // 500ms hold time
  };

  const handleMouseUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent dialog from opening if we just performed a theme toggle or swipe
    if (isHoldingRef.current || hasSwipedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      isHoldingRef.current = false;
      hasSwipedRef.current = false;
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    hasSwipedRef.current = false;
    isHoldingRef.current = false;

    // Start hold timer for touch devices
    holdTimeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      const { clientX: x, clientY: y } = touch;
      toggleTheme({ x, y });
    }, 500); // 500ms hold time
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    // Clear hold timeout if it exists
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const minSwipeDistance = 50;
    const maxVerticalDeviation = 100;
    const maxHorizontalDeviation = 100;

    // Check for horizontal swipes (left/right)
    if (Math.abs(deltaX) >= minSwipeDistance && Math.abs(deltaY) <= maxVerticalDeviation) {
      hasSwipedRef.current = true;
      if (deltaX > 0) {
        // Swipe right - previous theme
        changeToTheme(getPreviousTheme());
      } else {
        // Swipe left - next theme
        changeToTheme(getNextTheme());
      }
    }
    // Check for vertical swipes (up/down)
    else if (Math.abs(deltaY) >= minSwipeDistance && Math.abs(deltaX) <= maxHorizontalDeviation) {
      hasSwipedRef.current = true;
      if (deltaY < 0) {
        // Swipe up - next theme
        changeToTheme(getNextTheme());
      } else {
        // Swipe down - previous theme
        changeToTheme(getPreviousTheme());
      }
    }

    touchStartRef.current = null;
  };

  const handleTouchCancel = () => {
    // Clear hold timeout if touch is cancelled
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    touchStartRef.current = null;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer rounded-full"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <Palette className="h-7 w-7" />
          <span className="sr-only">Select theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="sticky top-0 bg-background pb-1 mr-8">
          <DialogTitle>Choose a Theme</DialogTitle>
          <DialogDescription className="!hidden md:!block">
            Select a theme preset and toggle between light and dark modes.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pt-1">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Dark/Light Mode</h4>
              <ThemeToggle />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4">Theme Presets</h4>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}