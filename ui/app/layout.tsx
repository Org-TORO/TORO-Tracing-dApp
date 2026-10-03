import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FooterWrapper from "@/components/FooterWrapper";
import { I18nProvider } from "@/src/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL("https://toro-dapp.vercel.app"),
  title: "TORO: Traceable Ocean Resource Origin",
  description:
    "Every tuna can remembers the ocean. TORO traces each can from catch to shelf, immutably signed on Solana. Scan a can and see its verified journey.",
  openGraph: {
    title: "TORO: Traceable Ocean Resource Origin",
    description:
      "Every tuna can remembers the ocean. Scan a TORO can and see its journey from catch to shelf, verified on Solana.",
    url: "/",
    siteName: "TORO",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "TORO — Every tuna can remembers the ocean",
      },
    ],
    locale: "en_US",
    alternateLocale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TORO: Traceable Ocean Resource Origin",
    description:
      "Every tuna can remembers the ocean. Scan a TORO can and see its verified journey on Solana.",
    images: ["/og-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <I18nProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <FooterWrapper />
        </I18nProvider>
      </body>
    </html>
  );
}
