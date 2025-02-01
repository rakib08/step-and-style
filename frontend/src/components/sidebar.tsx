"use client";

import Link from 'next/link';
import { FaBoxes, FaClipboardList, FaChartBar } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Step & Style</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="flex items-center space-x-2 hover:text-blue-500">
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li>
            <Link href="/products" className="flex items-center space-x-2 hover:text-blue-500">
              <FaClipboardList />
              <span>Products</span>
            </Link>
          </li>

          <li>
            <Link href="/inventory" className="flex items-center space-x-2 hover:text-blue-500">
              <FaBoxes />
              <span>Inventory</span>
            </Link>
          </li>
          
        </ul>
      </nav>
    </aside>
  );
}
