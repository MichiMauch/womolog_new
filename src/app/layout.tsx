import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Womolog - Unser Wohnmobil-Logbuch",
  description: "Im Womolog erfassen wir alle Standorte, auf welchem wir mit unserem Wohnmobil schon mal gestanden sind.",
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
        alt: 'Womolog Open Graph Image',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
