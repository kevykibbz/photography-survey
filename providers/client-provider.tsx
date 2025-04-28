"use client";

import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <FpjsProvider
      loadOptions={{
        apiKey: process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY!,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </FpjsProvider>
  );
}

export default ClientProvider;
