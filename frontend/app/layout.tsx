import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans"
});

export const metadata: Metadata = {
  title: "PamperMomma",
  description: "PamperMomma is a platform designed to support new mothers during the postpartum period by allowing them to create a registry of desired services such as nanny care, housekeeping, and meal prep. Friends and family can contribute financially or with their time to help new moms get the support they need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    suppressHydrationWarning={true}
    data-qb-installed={true}>
      <body
        className={`${publicSans.variable} antialiased **:font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
