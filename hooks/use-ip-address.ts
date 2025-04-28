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

  const fetchData = useCallback(async () => {
    try {
      const result = await getData();
      if (result.ip !== ip) setIp(result.ip);
      if (result.visitorId !== visitorId) setVisitorId(result.visitorId);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [getData, ip, visitorId]);

  useEffect(() => {
    if (!data && !fpLoading) {
      fetchData();
    }
  }, [data, fpLoading, fetchData]);
  return { ip, visitorId, isLoading, error,getData };
};
