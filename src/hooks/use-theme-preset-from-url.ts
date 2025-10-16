import React from "react";
import { useThemeStore } from "../stores/theme-store";

export const useThemePresetFromUrl = () => {
  const applyThemePreset = useThemeStore((state) => state.applyThemePreset);

  // Apply theme preset if it exists in URL
  React.useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const preset = urlParams.get("theme");

    if (preset) {
      applyThemePreset(preset);
      // Remove the preset from URL
      urlParams.delete("theme");
      const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [applyThemePreset]);
};