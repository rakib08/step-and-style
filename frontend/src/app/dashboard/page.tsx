'use client';

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaBell, FaUserCircle } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch inventory data');
        }

        const data = await res.json();
        setInventoryData(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const inStock = inventoryData.filter((item) => item.stock >= item.reorderLevel).length;
  const lowStock = inventoryData.filter((item) => item.stock > 0 && item.stock < item.reorderLevel).length;
  const outOfStock = inventoryData.filter((item) => item.stock === 0).length;

  const chartData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: 'Inventory Status',
        data: [inStock, lowStock, outOfStock],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex">

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-6">
              
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-2 gap-6">
          {/* Inventory Summary */}
          <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-700">Inventory Summary</h2>
            <div className="flex justify-between text-lg mt-3 text-gray-600">
              <span>✅ {inStock} In Stock</span>
              <span>⚠️ {lowStock} Low Stock</span>
              <span>❌ {outOfStock} Out of Stock</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-purple-500">
            <h2 className="text-xl font-bold text-gray-700">Order Summary</h2>
            <div className="flex justify-between text-lg mt-3 text-gray-600">
              <span>📦 20 Orders</span>
              <span>✅ 1040 Completed</span>
              <span>❌ 50 Canceled</span>
            </div>
          </div>
        </div>

        {/* Inventory Chart */}
        <div className="mt-12 flex justify-center">
          <div className="w-96">
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
