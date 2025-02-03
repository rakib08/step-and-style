// match the stock form inverntory in backend.

"use client";

import React, { useState, useEffect } from "react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from "react-icons/fa";
import debounce from "lodash/debounce";

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    quantity: "",
    sku: "",
    images: [] as File[], // Store selected images
  });

  // Debounce search to prevent excessive API calls
  const debouncedSearch = debounce(async (searchTerm) => {
    setLoading(true);
    try {
      const data = await fetchProducts(1, searchTerm);
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search]);
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      alert("Failed to load products");
    }
  };

  const openModal = (product: any | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);

    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        brand: product.brand || "",
        price: product.price ? product.price.toString() : "",
        quantity: product.quantity ? product.quantity.toString() : "",
        sku: product.sku || "",
        images: [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        quantity: "",
        sku: "",
        images: [],
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "images" && files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      closeModal();
      loadProducts();
    } catch (err) {
      alert("This Product Is Already Exists!");
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => openModal(null)}
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
        </div>

         {/* 🔍 Search Bar */}
         <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 p-3 rounded-lg border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">SKU</th> 
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600"
                      onClick={() => openModal(product)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600"
                      onClick={() => {
                        deleteProduct(product.id)
                        .then((product) => {
                         loadProducts();
                        })
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <FaTimes className="cursor-pointer" onClick={closeModal} />
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Product Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  placeholder="Category"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  placeholder="Brand"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Price"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  placeholder="Quantity"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleFormChange}
                  placeholder="SKU"
                  className="w-full p-2 border rounded"
                />

                {/* Image Upload Input */}
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                />

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}