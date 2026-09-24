import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata={title:"Treko Musi Artists",description:"Grow your audience with Treko Musi Rwanda."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}