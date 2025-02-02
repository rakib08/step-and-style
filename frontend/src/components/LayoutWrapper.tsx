"use client"; // Ensure this runs only on the client

import { usePathname } from "next/navigation";
import Sidebar from "../components/sidebar";
import { FaBell, FaUserCircle } from "react-icons/fa";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current route

  // Pages that should NOT show the sidebar & navbar
  const noLayoutPages = ["/login"];

  // Check if current page is in the noLayoutPages list
  const shouldShowLayout = !noLayoutPages.includes(pathname);

  return (
    <div className="flex">
      {/* Show Sidebar if not on Login Page */}
      {shouldShowLayout && <Sidebar />}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Show Navbar if not on Login Page */}
        {shouldShowLayout && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold"></h2>
            <div className="flex items-center space-x-4">
              <FaBell className="text-xl cursor-pointer" />
              <FaUserCircle className="text-2xl cursor-pointer" />
            </div>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
