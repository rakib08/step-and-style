export async function fetchProducts(page = 1, search = "", limit = 10) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&search=${search}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// Fetch a single product by ID
export async function fetchProductById(id: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }

  return res.json();
}

// Add a new product (Supports image upload)
export async function addProduct(productData: {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  quantity: number;
  sku: string;
  images: File[];
}) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("category", productData.category);
  formData.append("brand", productData.brand);
  formData.append("price", productData.price.toString());
  formData.append("quantity", productData.quantity.toString());
  formData.append("sku", productData.sku);

  // Append multiple images
  productData.images.forEach((image) => {
    formData.append("images", image);
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to add product");
  }

  return res.json();
}

// Update an existing product (Supports image upload)
export async function updateProduct(
  id: number,
  productData: {
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    quantity: number;
    sku: string;
    images: File[];
  }
) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("category", productData.category);
  formData.append("brand", productData.brand);
  formData.append("price", productData.price.toString());
  formData.append("quantity", productData.quantity.toString());
  formData.append("sku", productData.sku);

  productData.images.forEach((image) => {
    formData.append("images", image);
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
}

// Delete a product
export async function deleteProduct(id: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.log(res) 
    throw new Error("Failed to delete product");
  }

  return res.json();
}

// Bulk upload products using CSV
export async function bulkUploadProducts(csvFile: File) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", csvFile);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/bulk-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload CSV");
  }

  return res.json();
}

// Apply discount to a product
export async function applyProductDiscount(
  id: number,
  pricingData: { salePrice?: number; wholesalePrice?: number }
) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}/pricing`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pricingData),
  });

  if (!res.ok) {
    throw new Error("Failed to apply discount");
  }

  return res.json();
}
