import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ['latin'], // required
  variable: '--font-inter', // optional: for CSS variables
  display: 'swap', // recommended
});
export const metadata: Metadata = {
  title: "GymTracker - Transform Your Fitness Journey",
  description: "Personalized training, weekly check-ins, and progress tracking. Join thousands of fitness enthusiasts achieving their goals with GymTracker.",
  icons: {
    icon: '/images/lg.png',
    shortcut: '/images/lg.png',
    apple: '/images/lg.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
