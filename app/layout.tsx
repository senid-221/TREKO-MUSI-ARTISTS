import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trekomusic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Treko Music – Music Promotion & Distribution in Rwanda",
    template: "%s | Treko Music",
  },
  description:
    "Treko Music helps artists in Rwanda grow their audience through music promotion, distribution, artist community and music services.",
  keywords: [
    "Treko Music",
    "Rwanda music",
    "Rwandan artists",
    "music promotion Rwanda",
    "music distribution Rwanda",
    "artists community Rwanda",
    "Rwanda music artists",
  ],
  applicationName: "Treko Music",
  authors: [{ name: "Treko Music" }],
  creator: "Treko Music",
  publisher: "Treko Music",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_RW",
    url: "/",
    siteName: "Treko Music",
    title: "Treko Music – Music Promotion & Distribution in Rwanda",
    description:
      "A platform for Rwandan artists to grow their audience, promote music, connect and grow their careers.",
  },
  twitter: {
    card: "summary",
    title: "Treko Music – Music Promotion & Distribution in Rwanda",
    description:
      "Music promotion, distribution and artist growth platform in Rwanda.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Treko Music",
  url: siteUrl,
  description:
    "Music promotion, distribution and artist growth platform in Rwanda.",
  areaServed: {
    "@type": "Country",
    name: "Rwanda",
  },
  sameAs: [
    process.env.NEXT_PUBLIC_TREKO_INSTAGRAM,
    process.env.NEXT_PUBLIC_TREKO_FACEBOOK,
    process.env.NEXT_PUBLIC_TREKO_TIKTOK,
  ].filter(Boolean),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
