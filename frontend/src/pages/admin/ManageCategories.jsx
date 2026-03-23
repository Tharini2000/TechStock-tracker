import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from "../../services/categoryService";
import StatusMessage from "../../components/StatusMessage";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setStatus({ type: "error", text: "Failed to load categories." });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryName.trim()) {
      setStatus({ type: "error", text: "Category name is required." });
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setStatus({ type: "success", text: "Category updated." });
      } else {
        await createCategory(form);
        setStatus({ type: "success", text: "Category created." });
      }
      setForm({ categoryName: "", description: "" });
      setEditingId("");
      loadCategories();
    } catch (error) {
      setStatus({ type: "error", text: error.response?.data?.message || "Operation failed." });
    }
  };

  return (
    <section className="flex flex-col gap-4 lg:flex-row">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
        <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Category Name" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="md:col-span-2"><StatusMessage type={status.type} message={status.text} /></div>
          <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 md:col-span-2">
            {editingId ? "Update Category" : "Add Category"}
          </button>
        </form>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{cat.categoryName}</td>
                  <td className="px-3 py-2">{cat.description}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(cat._id); setForm({ categoryName: cat.categoryName, description: cat.description || "" }); }} className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Edit</button>
                      <button onClick={async () => { await deleteCategory(cat._id); loadCategories(); }} className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageCategories;
