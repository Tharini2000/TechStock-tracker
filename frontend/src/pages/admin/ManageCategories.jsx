import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../../services/categoryService";
import StatusMessage from "../../components/StatusMessage";
import {
  FolderTree,
  Tag,
  FileText,
  Pencil,
  Trash2,
  Save,
  Layers3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (error) {
      setStatus({ type: "error", text: "Failed to load categories." });
    } finally {
      setLoading(false);
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
      setSubmitting(true);

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
      setStatus({
        type: "error",
        text: error.response?.data?.message || "Operation failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      categoryName: cat.categoryName,
      description: cat.description || "",
    });
    setStatus({ type: "", text: "" });
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteCategory(id);
      setStatus({ type: "success", text: "Category deleted." });

      if (editingId === id) {
        setEditingId("");
        setForm({ categoryName: "", description: "" });
      }

      loadCategories();
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.message || "Failed to delete category.",
      });
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <Sidebar />

        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
                  <FolderTree size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
                    Category Control
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-white">
                    Manage Categories
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Create, update, and organize categories for your inventory
                    system.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-lg font-bold text-white">
                  {categories.length}
                </p>
                <p className="text-xs text-slate-400">Total Categories</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Categories</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {categories.length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <Layers3 size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Ready Categories</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {
                      categories.filter((cat) => cat.categoryName?.trim()).length
                    }
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Descriptions Missing</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {
                      categories.filter(
                        (cat) => !cat.description || !cat.description.trim()
                      ).length
                    }
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
            {/* Form Card */}
            <form
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
              onSubmit={handleSubmit}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Tag size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingId ? "Edit Category" : "Add Category"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    Enter category details below
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category Name
                  </label>
                  <div className="relative">
                    <Tag
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                      placeholder="Enter category name"
                      value={form.categoryName}
                      onChange={(e) =>
                        setForm({ ...form, categoryName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                  </label>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />
                    <textarea
                      rows="5"
                      className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                      placeholder="Enter category description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                </div>

                <StatusMessage type={status.type} message={status.text} />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save size={18} />
                    {submitting
                      ? editingId
                        ? "Updating..."
                        : "Adding..."
                      : editingId
                      ? "Update Category"
                      : "Add Category"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId("");
                        setForm({ categoryName: "", description: "" });
                        setStatus({ type: "", text: "" });
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Categories List */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <FolderTree size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Category List
                  </h2>
                  <p className="text-sm text-slate-400">
                    Manage all available categories
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                    <FolderTree size={28} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    No categories found
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Add your first category to organize your products better.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-left text-slate-400">
                          <th className="px-3 py-3 font-medium">Name</th>
                          <th className="px-3 py-3 font-medium">Description</th>
                          <th className="px-3 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr
                            key={cat._id}
                            className="border-b border-white/5 text-slate-300 transition hover:bg-white/5"
                          >
                            <td className="px-3 py-4 font-semibold text-white">
                              {cat.categoryName}
                            </td>
                            <td className="px-3 py-4 text-slate-300">
                              {cat.description || "No description"}
                            </td>
                            <td className="px-3 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(cat)}
                                  className="inline-flex items-center gap-1 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/25 hover:text-white"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </button>

                                <button
                                  onClick={() => handleDelete(cat._id)}
                                  disabled={deletingId === cat._id}
                                  className="inline-flex items-center gap-1 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Trash2 size={14} />
                                  {deletingId === cat._id ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="grid gap-4 lg:hidden">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-white">
                              {cat.categoryName}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {cat.description || "No description"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/25 hover:text-white"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(cat._id)}
                            disabled={deletingId === cat._id}
                            className="inline-flex items-center gap-1 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 size={14} />
                            {deletingId === cat._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageCategories;