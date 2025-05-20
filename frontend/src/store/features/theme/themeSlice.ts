import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  isDarkMode: boolean;
}

const getInitialTheme = (): ThemeState => {
  const stored = localStorage.getItem("theme") as ThemeMode | null;
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const mode: ThemeMode = stored || "system";
  const isDarkMode =
    mode === "dark" || (mode === "system" && systemPrefersDark);

  // Apply class on load
  document.documentElement.classList.toggle("dark", isDarkMode);

  return { mode, isDarkMode };
};

const initialState: ThemeState = getInitialTheme();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      // cycle system → light → dark → system
      const nextMode: ThemeMode =
        state.mode === "system"
          ? "light"
          : state.mode === "light"
          ? "dark"
          : "system";
      state.mode = nextMode;
      localStorage.setItem("theme", nextMode);

      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      state.isDarkMode =
        nextMode === "dark" || (nextMode === "system" && systemPrefersDark);
      document.documentElement.classList.toggle("dark", state.isDarkMode);
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      const mode = action.payload;
      state.mode = mode;
      localStorage.setItem("theme", mode);

      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      state.isDarkMode =
        mode === "dark" || (mode === "system" && systemPrefersDark);
      document.documentElement.classList.toggle("dark", state.isDarkMode);
    },
    applyStoredTheme(state) {
      const mode = (localStorage.getItem("theme") as ThemeMode) || "system";
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      state.mode = mode;
      state.isDarkMode =
        mode === "dark" || (mode === "system" && systemPrefersDark);
      document.documentElement.classList.toggle("dark", state.isDarkMode);
    },
  },
});

export const { toggleTheme, setTheme, applyStoredTheme } = themeSlice.actions;
export default themeSlice.reducer;
