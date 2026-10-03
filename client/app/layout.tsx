/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from 'react'
import { Geist } from "next/font/google";
import { cn } from "@/lib/common/utils";
import { Toaster } from "@/components/shadcn/toast";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "PosterLab",
  description: "Generate Owesome Poster with PosterLab",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  
  return (
    <html
      lang="en" className={cn("font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
