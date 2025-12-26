import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "CALENDARI",
  description: "Calendari mensual per organitzar-se la vida.",
  openGraph: {
    title: "CALENDARI",
    description: "Calendari mensual per organitzar-se la vida.",
    url: "https://calendari.martipardo.com",
    siteName: "CALENDARI",
    images: [
      {
        url: "https://calendari.martipardo.com/banner.png",
        width: 512,
        height: 512,
        alt: "Calendari logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CALENDARI",
    description: "Calendari mensual per organitzar-se la vida.",
    images: ["https://calendari.martipardo.com/banner.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
