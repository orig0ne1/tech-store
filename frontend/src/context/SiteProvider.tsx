"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getConfig } from "@/lib/config";
import { getCompany } from "@/lib/company";
import { getErrorMessage } from "@/lib/api";
import { useLocale } from "@/context/LocaleProvider";
import type { AppConfig } from "@/types/config";
import type { Company } from "@/types/company";
import { DEFAULT_CONFIG, DEFAULT_PRIMARY_COLOR } from "@/types/config";

interface SiteState {
  config: AppConfig | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SiteContext = createContext<SiteState>({
  config: null,
  company: null,
  loading: true,
  error: null,
  refresh: () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [cfg, comp] = await Promise.allSettled([getConfig(), getCompany()]);
    if (cfg.status === "fulfilled") {
      setConfig(cfg.value);
      const color = cfg.value.theme?.primaryColor;
      if (color) {
        document.documentElement.style.setProperty("--primary", color);
      }
    } else {
      setConfig(DEFAULT_CONFIG);
      document.documentElement.style.setProperty(
        "--primary",
        DEFAULT_PRIMARY_COLOR
      );
    }
    if (comp.status === "fulfilled") {
      setCompany(comp.value);
    } else {
      setError(getErrorMessage(comp.reason, t));
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    // Load site config/company once on mount (external system sync).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const value = useMemo(
    () => ({ config, company, loading, error, refresh: load }),
    [config, company, loading, error, load]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteState {
  return useContext(SiteContext);
}
