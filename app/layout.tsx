import "@/styles/globals.css"
import { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/components/react-query-provider"
import Toaster from "@/components/sonner"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-black font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ReactQueryProvider>
              <div className="relative flex min-h-screen flex-col mb-16">
                <div className="flex-1 pb-16 mb-16">
                  <Link href="/">
                    <img
                      src="/logo.png"
                      className="h-16 w-auto fixed top-8 left-8 z-50 cursor-pointer"
                    />
                  </Link>

                  {children}
                  <Toaster />
                </div>
              </div>
            </ReactQueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
