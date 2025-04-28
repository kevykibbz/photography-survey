"use client";

import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useEffect, useState, useCallback } from "react";

export const useVisitorIp = () => {
  const [ip, setIp] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    isLoading: fpLoading,
    data,
    getData,
  } = useVisitorData({ extendedResult: true }, { immediate: false });

  const fetchData = useCallback(
    async (ignoreCache = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getData({ ignoreCache });
        setIp(result?.ip ?? null);
        setVisitorId(result?.visitorId ?? "");
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [getData]
  );

  // Simplified retry (just an alias for fetchData with ignoreCache)
  const retry = useCallback(
    (ignoreCache = false) => fetchData(ignoreCache),
    [fetchData]
  );

  // Initial fetch
  useEffect(() => {
    if (!data && !fpLoading) {
      fetchData();
    }
  }, [data, fpLoading, fetchData]);

  return {
    ip,
    visitorId,
    isLoading: isLoading || fpLoading,
    error,
    retry,
  };
};