import React, { createContext, useContext, useEffect, useState } from "react";
import { cachedFetch } from "@/lib/api";
import { FALLBACK_SETTINGS } from "@/lib/fallback";
import type { AppSettings } from "@/lib/types";

interface SettingsContextValue {
  settings: AppSettings;
  isLoading: boolean;
  fromCache: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: FALLBACK_SETTINGS,
  isLoading: true,
  fromCache: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(FALLBACK_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    cachedFetch<AppSettings>("/cms/settings", "settings")
      .then((result) => {
        setSettings(result.data);
        setFromCache(result.fromCache);
      })
      .catch(() => {
        setSettings(FALLBACK_SETTINGS);
        setFromCache(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, fromCache }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
