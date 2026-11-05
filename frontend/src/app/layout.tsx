import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { SocketProvider } from "@/context/SocketContext";

export const metadata: Metadata = {
  title: "WhatsApp Web | Real-Time Chat App",
  description: "Real-Time Messaging Application inspired by WhatsApp Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-[#0b141a] text-[#e9edef] antialiased overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
        <AppProvider>
          <SocketProvider>{children}</SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
