import { Metadata } from "next";
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
    title: "Displaycontroller - Show",
    description: "",
};

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}