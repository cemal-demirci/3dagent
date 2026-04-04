import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claw3D \u2014 by Cemal Demirci",
  description: "AI agent workspace \u2014 cemal.cloud",
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
  themeColor: "#fbbf24",
  openGraph: {
    title: "Claw3D \u2014 by Cemal Demirci",
    description: "AI ajanlar\u0131n\u0131z i\u00e7in 3D \u00e7al\u0131\u015fma alan\u0131 \u2014 cemal.cloud",
    siteName: "Claw3D",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Claw3D \u2014 by Cemal Demirci",
    description: "AI agent workspace \u2014 cemal.cloud",
  },
};

const display = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fbbf24" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t?t==='dark':m;document.documentElement.classList.toggle('dark',d);}catch(e){}})();",
          }}
        />
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <main className="h-screen w-screen overflow-hidden bg-background">{children}</main>
      </body>
    </html>
  );
}
