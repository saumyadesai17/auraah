import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/ui/ThemeProvider"; // Removed
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auraah | Your Personal AI Productivity Companion",
  description: "Auraah - Your personal AI productivity companion. Revolutionizing the way you work with smart task management, seamless collaboration, and AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-800 antialiased`}> {/* Adjusted for light theme */}
        {/* <ThemeProvider> */} {/* Removed ThemeProvider wrapper */}
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}