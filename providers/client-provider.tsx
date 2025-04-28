"use client";

import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
const apiKey=process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY!
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: apiKey,
        // endpoint: "https://photoshowcase.tevinly.com",
        // scriptUrlPattern: `https://photoshowcase.tevinly.com/web/v2.6.3/${apiKey}/loader_v2.6.3.js`

      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </FpjsProvider>
  );
}

export default ClientProvider;
