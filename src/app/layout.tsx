import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Chemistry Portal",
    template: "%s | Chemistry Portal",
  },
  description: "Chemistry element data and Bohr model simulations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const observer = new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      mutation.target.removeAttribute('bis_skin_checked');
                    }
                    if (mutation.addedNodes) {
                      for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                          if (node.hasAttribute('bis_skin_checked')) {
                            node.removeAttribute('bis_skin_checked');
                          }
                          const descendants = node.querySelectorAll('[bis_skin_checked]');
                          for (const desc of descendants) {
                            desc.removeAttribute('bis_skin_checked');
                          }
                        }
                      }
                    }
                  }
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
