import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1000 Risos Festas",
  description: "Sistema de Gestão de Buffet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
