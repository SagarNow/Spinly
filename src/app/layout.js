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
  title: "Decido - Spin to Decide",
  description: "The anti-procrastination decision engine. Stop overthinking, add your tasks, spin the wheel or flip a coin, and crush your goals with voice-guided Pomodoro focus sprints. Built by Sagar.",
  keywords: [
    "Decido",
    "decision wheel",
    "pomodoro timer",
    "pomodoro voice coach",
    "focus timer with voice",
    "anti-procrastination",
    "task picker",
    "random decision maker",
    "3D coin flip",
    "deep work timer",
    "productivity tools",
    "eliminate overthinking"
  ],
  authors: [{ name: "Sagar", url: "https://github.com/SagarNow" }],
  creator: "Sagar",
  publisher: "Decido",
  icons: {
    icon: [
      { url: '/logo.svg?v=3', type: 'image/svg+xml' },
      { url: '/icon.svg?v=3', type: 'image/svg+xml' }
    ],
    shortcut: '/logo.svg?v=3',
    apple: '/logo.svg?v=3',
  },
  openGraph: {
    title: "Decido - Spin to Decide",
    description: "The anti-procrastination decision engine with physics wheel, 3D coin flip, and voice-guided Pomodoro focus sprints.",
    siteName: "Decido",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Decido - Spin to Decide",
    description: "Eliminate decision paralysis. Spin the wheel and lock in with voice-guided Pomodoro focus blocks.",
    creator: "@mrsagarsingh",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
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
