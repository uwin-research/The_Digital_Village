import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Digital Village | Your Phone, Your Privacy, Your Peace of Mind",
  description:
    "Free senior-friendly training to protect your phone. Learn screen lock, permissions, updates, and how to spot suspicious messages.",
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
