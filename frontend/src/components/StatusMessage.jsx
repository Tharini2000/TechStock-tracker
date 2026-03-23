const StatusMessage = ({ type = "info", message }) => {
  if (!message) return null;

  const styles = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-blue-200 bg-blue-50 text-blue-700"
  };

  return <p className={`rounded-lg border px-3 py-2 text-sm ${styles[type]}`}>{message}</p>;
};

export default StatusMessage;
