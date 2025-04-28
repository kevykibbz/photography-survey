import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import SiteFooter from "@/components/footer/site-footer";
import ClientProvider from "@/providers/client-provider";
import { Suspense } from "react";
import Loader from "@/components/loader/loader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: "PhotoShowcase | Next-Gen Photography Platform",
    template: "%s | PhotoShowcase",
  },
  description:
    "Connect with top photographers worldwide. Buy, sell, and showcase stunning photography.",
  applicationName: "PhotoShowcase",
  authors: [{ name: "Kevin Kibebe", url: "https://tevinly.com" }],
  generator: "Next.js",
  keywords: [
    "photography",
    "photo marketplace",
    "stock photos",
    "photographer portfolio",
    "photo contests",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Kevin Kibebe",
  publisher: "Tevinly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://photoshowcase.tevinly.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "PhotoShowcase | Photography Community Platform",
    description: "Discover and connect with photographers worldwide",
    url: "https://photoshowcase.tevinly.com",
    siteName: "PhotoShowcase",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PhotoShowcase Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhotoShowcase | Photography Community Platform",
    description: "Discover and connect with photographers worldwide",
    creator: "@Kevin36285655",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      new URL("/favicon.ico", "https://photoshowcase.tevinly.com"),
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-24.png", sizes: "24x24", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  category: "photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-blue-50 to-purple-50">
        <Suspense fallback={<Loader/>}>
          <ClientProvider>
            <main className="pb-20">{children}</main>
          </ClientProvider>
          <SiteFooter />
          <Toaster
            position="top-center"
            toastOptions={{
              className: "rounded-full",
              duration: 4000,
              success: {
                duration: 3000,
                className: "rounded-full",
              },
              error: {
                duration: 5000,
                className: "rounded-full",
              },
            }}
          />
        </Suspense>
      </body>
    </html>
  );
}
