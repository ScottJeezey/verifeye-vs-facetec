import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerifEye vs FaceTec - Comparison Tool",
  description: "Compare face verification experiences side-by-side",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
