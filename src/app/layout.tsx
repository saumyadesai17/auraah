import type { Metadata } from "next";
// import { ThemeProvider } from "@/components/ui/ThemeProvider"; // Removed
import "./globals.css";

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
      <body className={`bg-white text-gray-800 antialiased`}> {/* Adjusted for light theme */}
        {/* <ThemeProvider> */} {/* Removed ThemeProvider wrapper */}
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}