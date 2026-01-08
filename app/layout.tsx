import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ViewProvider } from "@/contexts/ViewContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ToastContainer from "@/components/ToastContainer";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Coomer Browser",
  description: "Browse and discover content from your favorite creators",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Coomer Browser",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider>
            <ViewProvider>
              <HistoryProvider>
                <ToastProvider>
                  {children}
                  <BottomNav />
                  <ToastContainer />
                </ToastProvider>
              </HistoryProvider>
            </ViewProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
