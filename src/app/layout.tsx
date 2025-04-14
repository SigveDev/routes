"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the QueryClient instance on the client side
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
