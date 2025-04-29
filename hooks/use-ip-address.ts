"use client";

import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useEffect, useState, useCallback } from "react";

export const useVisitorIp = () => {
  const [ip, setIp] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); 
  const [isFetching, setIsFetching] = useState(false); 
  const [error, setError] = useState<Error | null>(null);

  const {
    isLoading: fpLoading,
    data,
    getData,
  } = useVisitorData({ extendedResult: true }, { immediate: false });

  const fetchData = useCallback(async (ignoreCache = false) => {
    const isInitialLoad = !ip && !visitorId && !error;
    isInitialLoad ? setIsLoading(true) : setIsFetching(true);
    setError(null);
    
    try {
      const result = await getData({ ignoreCache });
      setIp(result?.ip ?? null);
      setVisitorId(result?.visitorId ?? "");
    } catch (err) {
      setError(err as Error);
    } finally {
      isInitialLoad ? setIsLoading(false) : setIsFetching(false);
    }
  }, [getData, ip, visitorId, error]);

  const retry = useCallback((ignoreCache = false) => {
    fetchData(ignoreCache);
  }, [fetchData]);

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
    isFetching, 
    error,
    retry,
  };
};