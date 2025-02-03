'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchInventory, adjustStock, reorderStock, downloadReport } from '../api/inventory';
import { FaSearch, FaSync, FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchInventory(token);
        setInventory(data);

        // Extract user role from JWT
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleAdjustStock = async (productId: number, adjustment: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await adjustStock(productId, adjustment, token);
      setInventory((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, stock: item.stock + adjustment } : item
        )
      );
    } catch (err) {
      console.error('Stock Adjustment Failed:', err);
    }
  };

  const handleReorderStock = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await reorderStock(productId, token);
      alert('Stock reordered successfully!');
    } catch (err) {
      console.error('Stock Reorder Failed:', err);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      // 📌 Fetch inventory data from the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (!response.ok) {
        throw new Error('Failed to fetch inventory report');
      }
  
      const data = await response.json(); // 📌 Convert response to JSON

      const csvData = data.map((item: any) => ({
        ID: item.id,
        Product_Name: item.product.name,
        Category: item.product.category,
        Brand: item.product.brand,
        SKU: item.product.sku,
        Price: item.product.price,
        Stock: item.stock,
        Reorder_Level: item.reorderLevel,
        Last_Updated: item.lastUpdated,
      }));

      // 📌 Convert data to CSV format
    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Inventory_Report.csv'; // 📌 Set file name
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Error downloading report:', error);
  }
};
  


  const filteredInventory = inventory.filter((item) =>
    item.product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>

        {userRole === 'manager' && (
          <button
            onClick={handleDownloadReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
          >
            <FaDownload className="mr-2" />
            Download Report
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr className='bg-blue-500 text-white text-center'>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Reorder Level</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id} className="border-t text-center">
                <td className="p-3">{item.product.name}</td>
                <td className="p-3">{item.product.category}</td>
                <td className="p-3">{item.stock}</td>
                <td className="p-3">{item.reorderLevel}</td>
                <td className="p-3 flex space-x-2">
                {userRole === 'manager' && (
  <div className="flex justify-center items-center gap-2">
    <button
      onClick={() => handleAdjustStock(item.id, 1)}
      className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600 flex items-center justify-center"
    >
      +
    </button>
    <button
      onClick={() => handleAdjustStock(item.id, -1)}
      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 flex items-center justify-center"
    >
      -
    </button>
    {item.stock < item.reorderLevel && (
      <button
        onClick={() => handleReorderStock(item.id)}
        className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 flex items-center justify-center"
      >
        <FaSync className="mr-1" />
        Reorder
      </button>
    )}
  </div>
)}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
