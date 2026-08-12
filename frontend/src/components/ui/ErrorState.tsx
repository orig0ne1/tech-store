"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider";
import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLocale();
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-4 rounded-xl px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="size-6" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{t.common.somethingWentWrong}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" />
          {t.common.retry}
        </Button>
      )}
    </div>
  );
}
