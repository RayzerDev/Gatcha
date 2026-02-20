import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {Toaster} from "react-hot-toast";
import "./globals.css";
import {AuthProvider} from "@/contexts/AuthContext";
import {Navbar} from "@/components/ui";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Gatcha Game",
    description: "Gatcha gacha game with authentication",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="h-full overflow-hidden">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        >
        <AuthProvider>
            <div className="h-full flex flex-col bg-linear-to-br from-zinc-900 via-purple-900/20 to-zinc-900">
                <Navbar/>
                <main className="flex-1 flex flex-col overflow-y-auto">
                    {children}
                </main>
            </div>
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }}/>
        </AuthProvider>
        </body>
        </html>
    );
}
