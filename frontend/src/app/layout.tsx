import "./globals.css"; // Import global styles
import { Inter } from "next/font/google";
import LayoutWrapper from "../components/LayoutWrapper"; // Import LayoutWrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Step & Style",
  description: "Dashboard for managing inventory and products",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap everything inside LayoutWrapper */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
