import type { Metadata } from "next";
import { Inter,Ubuntu } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const ubuntu= Ubuntu({weight:"400",style:"normal", subsets:["latin"]})

export const metadata: Metadata = {
  title: "Hubble",
  description: "A chatting application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://kit.fontawesome.com/14c3c193f7.js"/>
      </head>
      <body className={ubuntu.className}>{children}</body>
    </html>
  );
}
