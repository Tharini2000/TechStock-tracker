const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      {label}
    </div>
  );
};

export default LoadingSpinner;
