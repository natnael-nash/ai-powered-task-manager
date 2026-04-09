import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import SideNav from "./components/layout/SideNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI automated Task Manager",
  description: "This is a demo project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col p-5">
        <Navbar />

        {/* <div className="my-4"> */}
        <div className="my-4 w-full h-full min-h-screen flex flex-row bg-[#E7E5E6] rounded-2xl text-black pl-5 pr-2">
          <SideNav />
          <div className="flex flex-1  py-2">{children}</div>
        </div>
      </body>
    </html>
  );
}
