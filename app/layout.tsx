import type { Metadata, Viewport } from "next";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/fira-sans/latin-400.css";
import "@fontsource/fira-sans/latin-500.css";
import "@fontsource/fira-sans/latin-600.css";
import "animate.css";
import "./globals.css";
import "@/styles/portfolio.css";
import "@/styles/animations.css";

const title = "Phillip Lisboa | Aspiring Cybersecurity Professional";
const description = "Phillip Lisboa — Business Informatics student exploring cybersecurity, Linux systems and web development.";

export const metadata: Metadata = {
  metadataBase: new URL("https://phelis.dev"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "Phillip Lisboa", title, description, locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#17141f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
