"use client"; // Ensure this runs only on the client

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import { FaBell, FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie"; // For cookie management

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Pages that should NOT show the sidebar & navbar
  const noLayoutPages = ["/login"];
  const shouldShowLayout = !noLayoutPages.includes(pathname);

  // Handle logout
  const handleLogout = () => {
    // Remove JWT from localStorage and cookies
    localStorage.removeItem("token");
    Cookies.remove("token");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="flex">
      {shouldShowLayout && <Sidebar />}

      <main className="flex-1 p-6 bg-gray-100">
        {shouldShowLayout && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold"></h2>

            {/* Navbar Icons */}
            <div className="flex items-center space-x-4 relative">
              <FaBell className="text-xl cursor-pointer" />

              {/* Profile Icon with Hover Dropdown */}
              <div className="relative group">
                <FaUserCircle className="text-2xl cursor-pointer" />

                {/* Dropdown (Appears on Hover) */}
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
