import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {Toaster} from "react-hot-toast";
import "./globals.css";
import {AuthProvider} from "@/contexts/AuthContext";

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
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            {children}
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
