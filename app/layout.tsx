// app/layout.tsx
import "./globals.css"; // Se você não tiver este arquivo, pode remover esta linha
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Z-Image Turbo Gen",
  description: "Gerador de imagens ultra fiel e rápido",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
