import React, { ErrorInfo, ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import i18n from "@/i18n";

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      // Mute the persistent WebSocket HMR error which is non-fatal but annoying
      if (event.error?.message?.includes("WebSocket closed without opened")) {
        return;
      }
      setHasError(true);
      setError(event.error);
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      // Mute the persistent WebSocket HMR error which is non-fatal but annoying
      if (event.reason?.message?.includes("WebSocket closed without opened")) {
        return;
      }
      setHasError(true);
      setError(event.reason);
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", rejectionHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  if (hasError) {
    let message = i18n.t("errors.unexpected", "Kutilmagan xatolik yuz berdi.");
    try {
      if (error?.message) {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.includes("insufficient permissions")) {
          message = i18n.t(
            "errors.permission_denied",
            "Sizda ushbu amalni bajarish uchun ruxsat yo'q."
          );
        }
      }
    } catch (e) {
      message = error?.message || message;
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-sm p-12 text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">{i18n.t("errors.title", "Xatolik!")}</h2>
          <p className="text-muted-foreground font-light">{message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white rounded-none px-8"
          >
            {i18n.t("errors.refresh", "Sahifani yangilash")}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
