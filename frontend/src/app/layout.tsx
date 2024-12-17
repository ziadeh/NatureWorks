import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/header/Navbar";

// import { SessionProvider } from 'next-auth/react';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import Provider from "@/components/Provider";
import LoggedInClient from "@/components/loggedIn/LoggedInClient";
import LoggedInServer from "@/components/loggedIn/LoggedInServer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Entrepreneurship Champions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
        className={`${inter.className} pb-40 bg-gradient-to-b from-orange-50 to-white min-h-screen`}
      >
        <Provider session={session}>
          <main>{children}</main>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
