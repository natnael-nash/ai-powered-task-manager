import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import SideNav from "./components/layout/SideNav";
import { ToastContainer } from "react-toastify";

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
        <div className="my-4 w-full h-full min-h-screen flex flex-col lg:flex-row bg-[#E7E5E6] rounded-2xl text-black pl-5 pr-2">
          <ToastContainer />
          <SideNav />
          <div className="w-full py-2">
            <div className="flex flex-1 mx-auto w-full rounded-2xl border border-zinc-200 bg-white p-6 ">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
