import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import MatomoTracker from "../components/MatomoTracker";  // Importiere die Client-Komponente
import Footer from '../components/Footer';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Womolog - Unser Wohnmobil-Logbuch",
  description: "Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.",
  robots: 'index, follow',
  alternates: {
    canonical: 'https://womolog.ch',
  },
  openGraph: {
    type: 'website',
    url: 'https://womolog.ch',
    title: 'Womolog - Unser Wohnmobil-Logbuch',
    description: 'Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.',
    images: [
      {
        url: 'https://womolog.ch/images/camper.jpeg',
        width: 1200,
        height: 630,
        alt: 'Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@michimauch',
    creator: '@michimauch',
    title: 'Womolog - Unser Wohnmobil-Logbuch',
    description: 'Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.',
    images: [
      'https://womolog.ch/images/camper.jpeg',
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
      <body className={inter.className}>
        <MatomoTracker /> {/* Hier fügen wir die Matomo Client-Komponente ein */}
        {children}
      </body>
    </html>
  );
}
