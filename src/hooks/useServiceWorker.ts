"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useServiceWorker() {
  const [registered, setRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        setRegistered(true);

        const onUpdateFound = () => {
          const installing = reg.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              waitingRef.current = installing;
              setUpdateAvailable(true);
            }
          });
        };

        if (reg.waiting && navigator.serviceWorker.controller) {
          waitingRef.current = reg.waiting;
          setUpdateAvailable(true);
        }

        reg.addEventListener("updatefound", onUpdateFound);
      })
      .catch(() => {
        // SW registration failed — silent in production
      });

    // Reload once the new SW takes control
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    waitingRef.current?.postMessage({ type: "SKIP_WAITING" });
  }, []);

  return { registered, updateAvailable, applyUpdate };
}
