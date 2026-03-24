import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { createProduct, getNextProductId } from "../../services/productService";
import { useToast } from "../../context/ToastContext";
import { fetchCategories } from "../../services/categoryService";
import {
  PackagePlus,
  Layers3,
  DollarSign,
  Boxes,
  Image as ImageIcon,
  FileText,
  Save,
  ArrowLeft,
  Tag,
} from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    image: null,
    productId: ""
  });

  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadNextProductId = async () => {
      try {
        const { nextProductId } = await getNextProductId();
        setForm((prev) => ({ ...prev, productId: nextProductId || "" }));
      } catch {
        showToast("Failed to fetch next product ID", "error");
      }
    };

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await fetchCategories();
        const sorted = [...data].sort((a, b) =>
          a.categoryName.localeCompare(b.categoryName)
        );
        setCategories(sorted);
      } catch {
        showToast("Failed to load categories", "error");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadNextProductId();
    loadCategories();
  }, [showToast]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file", "error");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be less than 5MB", "error");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result;
      setForm({ ...form, image: base64String });
      setImagePreview(base64String);
      setErrors({ ...errors, image: "" }); // Clear image error
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!form.quantity && form.quantity !== "0") {
      newErrors.quantity = "Quantity is required";
    } else if (Number(form.quantity) < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    if (!form.image) {
      newErrors.image = "Product image is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill in all required fields correctly", "error");
      return;
    }

    try {
      setSaving(true);

      await createProduct({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });

      showToast("Product added successfully", "success");
      navigate("/admin/products");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to add product",
        "error"
      );
    } finally {
      setSaving(false);
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
                  <PackagePlus size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
                    Inventory Control
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-white">
                    Add New Product
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Create a new inventory item with product details, pricing,
                    stock quantity, and category.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ArrowLeft size={18} />
                Back to Products
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Layers3 size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Product Information
                  </h2>
                  <p className="text-sm text-slate-400">
                    Fill in the product details below
                  </p>
                </div>
              </div>

              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Product ID
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 px-4 text-white cursor-not-allowed"
                    value={form.productId}
                    readOnly
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <PackagePlus
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`w-full rounded-xl border bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition ${
                        errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                          : "border-white/10 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                      }`}
                      placeholder="Enter product name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (e.target.value.trim()) {
                          setErrors({ ...errors, name: "" });
                        }
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Tag
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <select
                        className={`w-full appearance-none rounded-xl border bg-slate-900/70 py-3 pl-11 pr-4 text-white outline-none transition ${
                          errors.category
                            ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : "border-white/10 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                        }`}
                        value={form.category}
                        onChange={(e) => {
                          setForm({ ...form, category: e.target.value });
                          if (e.target.value) {
                            setErrors({ ...errors, category: "" });
                          }
                        }}
                        disabled={loadingCategories}
                      >
                        <option value="" className="bg-slate-900">
                          {loadingCategories
                            ? "Loading categories..."
                            : "Select Category"}
                        </option>
                        {categories.map((cat) => (
                          <option
                            key={cat._id}
                            value={cat._id}
                            className="bg-slate-900"
                          >
                            {cat.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Quantity <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Boxes
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="number"
                        min="0"
                        className={`w-full rounded-xl border bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition ${
                          errors.quantity
                            ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : "border-white/10 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                        }`}
                        placeholder="Enter quantity"
                        value={form.quantity}
                        onChange={(e) => {
                          setForm({ ...form, quantity: e.target.value });
                          if (e.target.value && Number(e.target.value) >= 0) {
                            setErrors({ ...errors, quantity: "" });
                          }
                        }}
                      />
                    </div>
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-400">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`w-full rounded-xl border bg-slate-900/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition ${
                          errors.price
                            ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : "border-white/10 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20"
                        }`}
                        placeholder="Enter price"
                        value={form.price}
                        onChange={(e) => {
                          setForm({ ...form, price: e.target.value });
                          if (e.target.value && Number(e.target.value) > 0) {
                            setErrors({ ...errors, price: "" });
                          }
                        }}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-400">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Product Image <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <ImageIcon
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                      <div className={`w-full rounded-xl border bg-slate-900/70 py-3 pl-11 pr-4 text-white cursor-pointer transition ${
                        errors.image
                          ? "border-red-500"
                          : "border-white/10 hover:border-brand-500"
                      }`}>
                        {form.image ? (
                          <span className="text-sm text-emerald-400">Image selected ✓</span>
                        ) : (
                          <span className="text-sm text-slate-500">Click to select an image</span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-400">{errors.image}</p>
                    )}
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
                      placeholder="Enter product description"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Add Product"}
                  </button>

                  <Link
                    to="/admin/products"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>

            {/* Preview / Info Panel */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Product Preview
                    </h2>
                    <p className="text-sm text-slate-400">
                      Live preview of the new product
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-500">
                        <ImageIcon size={40} className="mx-auto mb-3" />
                        <p className="text-sm">Image preview will appear here</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="truncate text-lg font-semibold text-white">
                      {form.name || "Product Name"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {form.description || "Product description preview"}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-slate-400">Price</span>
                      <span className="font-semibold text-white">
                        ${form.price || "0.00"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Quantity</span>
                      <span className="font-semibold text-white">
                        {form.quantity || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-brand-500/10 via-cyan-500/10 to-indigo-500/10 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">
                  Product Entry Tips
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Use a clear product name, select the correct category, upload a
                  product image, and enter accurate stock quantity and pricing
                  for better inventory management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;