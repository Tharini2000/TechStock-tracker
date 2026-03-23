import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 2800);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-64 rounded-xl border px-4 py-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : toast.type === "error"
                  ? "border-rose-300 bg-rose-50 text-rose-800"
                  : "border-sky-300 bg-sky-50 text-sky-800"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
