import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Decido — Spin to Decide",
  description: "The anti-procrastination decision engine. Stop overthinking, add your tasks, spin the wheel or flip a coin, and crush your goals with focus blocks. Built by Sagar.",
  icons: {
    icon: [
      { url: '/logo.svg?v=3', type: 'image/svg+xml' },
      { url: '/icon.svg?v=3', type: 'image/svg+xml' }
    ],
    shortcut: '/logo.svg?v=3',
    apple: '/logo.svg?v=3',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#070913] text-slate-100 min-h-screen flex flex-col select-none`}
      >
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
