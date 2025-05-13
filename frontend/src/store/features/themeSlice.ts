import { createSlice } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  isDarkMode: boolean;
}

const getInitialTheme = (): ThemeState => {
  const stored = localStorage.getItem("theme") as ThemeMode | null;
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const mode: ThemeMode = stored || "system";
  const isDarkMode = mode === "dark" || (mode === "system" && systemPrefersDark);

  return { mode, isDarkMode };
};

const initialState: ThemeState = getInitialTheme();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      // Toggle between system → light → dark → system
      const nextMode: ThemeMode =
        state.mode === "system" ? "light" : state.mode === "light" ? "dark" : "system";

      localStorage.setItem("theme", nextMode);

      const isDark =
        nextMode === "dark" ||
        (nextMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

      state.mode = nextMode;
      state.isDarkMode = isDark;

      document.documentElement.classList.toggle("dark", isDark);
    },
    applyStoredTheme(state) {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mode = localStorage.getItem("theme") as ThemeMode | null || "system";
      const isDark = mode === "dark" || (mode === "system" && systemPrefersDark);

      state.mode = mode;
      state.isDarkMode = isDark;

      document.documentElement.classList.toggle("dark", isDark);
    },
  },
});

export const { toggleTheme, applyStoredTheme } = themeSlice.actions;
export default themeSlice.reducer;
