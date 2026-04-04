import type { Metadata, Viewport } from "next";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { PWAUpdateBanner } from "@/features/pwa/PWAUpdateBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://3d.cemal.cloud"),
  title: "3DAgent — 3D AI Agent Workspace",
  description:
    "AI ajanlarınız için gerçek zamanlı 3D çalışma ortamı. Sesli komut, multi-agent yönetimi, marketplace ve kanban — hepsi tek workspace'te.",
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "3DAgent",
  },
  openGraph: {
    title: "3DAgent — 3D AI Agent Workspace",
    description:
      "AI ajanlarınız için gerçek zamanlı 3D çalışma ortamı. Sesli komut, multi-agent yönetimi, marketplace ve kanban.",
    siteName: "3DAgent",
    type: "website",
    url: "https://3d.cemal.cloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "3DAgent — 3D AI Agent Workspace",
    description:
      "AI ajanlarınız için gerçek zamanlı 3D çalışma ortamı. Sesli komut, multi-agent, marketplace ve kanban.",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbbf24",
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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t?t==='dark':m;document.documentElement.classList.toggle('dark',d);}catch(e){}})();",
          }}
        />
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <main className="min-h-screen w-full bg-background">{children}</main>
        <PWAUpdateBanner />
      </body>
    </html>
  );
}
