// import
import type { Metadata } from "next"
import { Inter } from "next/font/google"

// styles
import "bootstrap/dist/css/bootstrap.min.css"
import "@/styles/globals.css"
import "@/styles/theme.scss"
// import "@/styles/font-awesome-6-pro/css/all.css";

// wrapper
import ClientWrapper from "@/components/utils/ClientWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XO",
  description: "Tic Tac Toe Game",
  icons: {
    icon: "/logo.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee+Tint&family=Itim&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} position-relative`} id="body">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
