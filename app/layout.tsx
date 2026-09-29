import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Digital Village | Your Phone, Your Privacy, Your Peace of Mind",
  description:
    "Free senior-friendly training to protect your phone. Learn screen lock, permissions, updates, and how to spot suspicious messages.",
};

/**
 * THIS IS THE FIX for the mobile "desktop-sized page squeezed into a tiny
 * phone screen, requires zooming out to see anything" problem.
 *
 * Without this, mobile browsers don't know the page is built to fit a
 * phone's actual width, so they assume a generic ~980px desktop canvas
 * and shrink the whole rendered page down to fit the phone screen —
 * which makes every element (including the Sign in / Sign out button)
 * tiny and can push content off to the right, exactly like your
 * screenshots showed.
 *
 * `width: "device-width"` tells the browser: "render this page at the
 * phone's real width (e.g. 375px), don't pretend it's a desktop."
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        <AuthProvider>
          <AccessibilityProvider>
            <ClientLayout>{children}</ClientLayout>
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
