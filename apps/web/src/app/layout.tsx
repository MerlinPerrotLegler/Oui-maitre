"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const metadata = { title: 'Oui-Maître' };

const qc = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <QueryClientProvider client={qc}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
