import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { createProduct } from "../../services/productService";
import { useToast } from "../../context/ToastContext";
import { fetchCategories } from "../../services/categoryService";

const AddProduct = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", quantity: "", image: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        const sorted = [...data].sort((a, b) => a.categoryName.localeCompare(b.categoryName));
        setCategories(sorted);
      } catch {
        showToast("Failed to load categories", "error");
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || Number(form.price) < 0 || Number(form.quantity) < 0) {
      showToast("Please provide valid product details", "error");
      return;
    }

    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity)
      });
      showToast("Product added", "success");
      navigate("/admin/products");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to add product", "error");
    }
  };

  return (
    <section className="flex flex-col gap-4 lg:flex-row">
      <Sidebar />
      <form onSubmit={handleSubmit} className="flex-1 space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h1 className="text-2xl font-bold text-slate-900">Add Product</h1>
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="w-full rounded-lg border px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
          ))}
        </select>
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" min="0" className="w-full rounded-lg border px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="number" min="0" className="w-full rounded-lg border px-3 py-2" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Save Product</button>
      </form>
    </section>
  );
};

export default AddProduct;
