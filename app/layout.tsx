import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jennifer Academy | 英語學習平台",
  description: "國小、國中、成人初學者專屬英語學習頻道",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-neutral-50 dark:bg-black">
          <Sidebar />
          <div className="flex-1 md:ml-64 pt-16 md:pt-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
