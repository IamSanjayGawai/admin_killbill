import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import api from "../utils/api";

type ThemeMode = "light" | "dark" | "auto";

interface ThemeState {
  mode: ThemeMode;
  accentColor: string;
  loading: boolean;
  saving: boolean;
  error?: string;
  lastSyncedAt?: string;
  dirty: boolean;
}

interface ThemeContextValue extends ThemeState {
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  saveTheme: (mode?: ThemeMode, accentColor?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "admin-theme-preference";
const DEFAULT_ACCENT = "#3b82f6";

interface ThemeApiResponse {
  data?: {
    theme?: ThemeMode;
    accentColor?: string;
    updatedAt?: string;
  };
}

const resolveSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const getPersistedTheme = (): { mode: ThemeMode; accentColor: string } | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return null;
    const mode: ThemeMode = ["light", "dark", "auto"].includes(parsed.mode)
      ? parsed.mode
      : "light";
    const accentColor =
      typeof parsed.accentColor === "string" && parsed.accentColor.startsWith("#")
        ? parsed.accentColor
        : DEFAULT_ACCENT;
    return { mode, accentColor };
  } catch {
    return null;
  }
};

const persistTheme = (mode: ThemeMode, accentColor: string) => {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode, accentColor }));
};

const applyDomTheme = (mode: ThemeMode, accentColor: string) => {
  const resolved = mode === "auto" ? resolveSystemTheme() : mode;
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(`theme-${resolved}`);
  document.documentElement.style.setProperty("--accent-color", accentColor);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const persisted = getPersistedTheme();
  const [state, setState] = useState<ThemeState>({
    mode: persisted?.mode || "light",
    accentColor: persisted?.accentColor || DEFAULT_ACCENT,
    loading: true,
    saving: false,
    dirty: false,
  });

  const mediaListenerAdded = useRef(false);

  const syncThemeToDom = useCallback(
    (mode: ThemeMode, accentColor: string) => {
      applyDomTheme(mode, accentColor);
      persistTheme(mode, accentColor);
    },
    []
  );

  const fetchTheme = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      syncThemeToDom(state.mode, state.accentColor);
      setState((prev) => ({ ...prev, loading: false, dirty: false }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    try {
      const { data } = await api.get<ThemeApiResponse>("/api/admin/settings/theme");
      const payload = data?.data || {};
      const mode: ThemeMode = ["light", "dark", "auto"].includes(payload.theme ?? "")
        ? (payload.theme as ThemeMode)
        : "light";
      const accentColor =
        typeof payload.accentColor === "string"
          ? payload.accentColor
          : DEFAULT_ACCENT;

      syncThemeToDom(mode, accentColor);

      setState((prev) => ({
        ...prev,
        mode,
        accentColor,
        loading: false,
        lastSyncedAt: payload.updatedAt,
        dirty: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message || "Could not load theme preferences",
      }));
      // Keep using persisted/local theme
      syncThemeToDom(state.mode, state.accentColor);
    }
  }, [state.accentColor, state.mode, syncThemeToDom]);

  useEffect(() => {
    syncThemeToDom(state.mode, state.accentColor);
    fetchTheme();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mediaListenerAdded.current) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMedia = () => {
      if (state.mode === "auto") {
        syncThemeToDom("auto", state.accentColor);
      }
    };
    media.addEventListener("change", handleMedia);
    mediaListenerAdded.current = true;
    return () => media.removeEventListener("change", handleMedia);
  }, [state.mode, state.accentColor, syncThemeToDom]);

  const saveTheme = useCallback(
    async (mode?: ThemeMode, accentColor?: string) => {
      const nextMode = mode ?? state.mode;
      const nextAccent = accentColor ?? state.accentColor;

      setState((prev) => ({
        ...prev,
        mode: nextMode,
        accentColor: nextAccent,
        saving: true,
        error: undefined,
      }));
      syncThemeToDom(nextMode, nextAccent);

      try {
        await api.put("/api/admin/settings/theme", {
          theme: nextMode,
          accentColor: nextAccent,
        });
        setState((prev) => ({
          ...prev,
          saving: false,
          lastSyncedAt: new Date().toISOString(),
          dirty: false,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          saving: false,
          error: error?.response?.data?.message || "Failed to save theme",
        }));
      }
    },
    [state.mode, state.accentColor, syncThemeToDom]
  );

  const value: ThemeContextValue = useMemo(
    () => ({
      ...state,
      setMode: (mode) => {
        syncThemeToDom(mode, state.accentColor);
        setState((prev) => ({
          ...prev,
          mode,
          dirty: true,
          error: undefined,
        }));
        persistTheme(mode, state.accentColor);
      },
      setAccentColor: (color) => {
        syncThemeToDom(state.mode, color);
        setState((prev) => ({
          ...prev,
          accentColor: color,
          dirty: true,
          error: undefined,
        }));
        persistTheme(state.mode, color);
      },
      saveTheme,
      refresh: fetchTheme,
    }),
    [fetchTheme, saveTheme, state]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Graceful fallback to avoid crashing if provider is not mounted (e.g. error routes)
    console.warn("useTheme called outside ThemeProvider. Falling back to defaults.");
    return {
      mode: "light" as ThemeMode,
      accentColor: DEFAULT_ACCENT,
      loading: false,
      saving: false,
      dirty: false,
      setMode: () => {},
      setAccentColor: () => {},
      saveTheme: async () => {},
      refresh: async () => {},
    };
  }
  return ctx;
};

