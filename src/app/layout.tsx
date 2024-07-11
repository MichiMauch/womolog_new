import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Womolog - Unser Wohnmobil-Logbuch",
  description: "Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.",
  robots: 'index, follow', // Ersetze dies durch die gewünschten robots-Einstellungen
  alternates: {
    canonical: 'https://womolog.ch',
  },
  openGraph: {
    type: 'website',
    url: 'https://womolog.ch', // Ersetze dies durch deine tatsächliche URL
    title: 'Womolog - Unser Wohnmobil-Logbuch',
    description: 'Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.',
    images: [
      {
        url: 'https://womolog.ch/images/camper.jpeg', // Ersetze dies durch den Pfad zu deinem Bild
        width: 1200,
        height: 630,
        alt: 'Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@michimauch', // Ersetze dies durch deinen Twitter-Handle
    creator: '@michimauch', // Ersetze dies durch den Twitter-Handle des Erstellers
    title: 'Womolog - Unser Wohnmobil-Logbuch',
    description: 'Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.',
    images: [
      'https://womolog.ch/images/camper.jpeg', // Ersetze dies durch den Pfad zu deinem Bild
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
