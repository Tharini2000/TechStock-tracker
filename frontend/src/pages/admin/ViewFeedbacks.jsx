import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeedbacks } from "../../services/feedbackService";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  MessageSquareText,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  MessageSquare,
  Star,
} from "lucide-react";

const ViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getFeedbacks();
        console.log("Feedbacks loaded:", data); // Debug log
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load feedbacks:", error); // Debug log
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  if (loading) return <LoadingSpinner label="Loading feedbacks..." />;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 px-4 py-10">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <Link
            to="/admin"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 text-slate-300 transition hover:border-brand-500 hover:bg-brand-500/10 hover:text-brand-400"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg">
              <MessageSquareText size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Customer Feedbacks</h1>
              <p className="mt-1 text-sm text-slate-400">
                Review feedbacks from your customers
              </p>
            </div>
          </div>
          <div className="ml-auto rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
            <p className="text-lg font-bold text-white">{feedbacks.length}</p>
            <p className="text-xs text-slate-400">Total Feedbacks</p>
          </div>
        </div>

        {/* Feedbacks List */}
        {feedbacks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-slate-300">
              <MessageSquare size={36} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">
              No feedbacks yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              Customers haven't submitted any feedbacks yet. Once they do, they
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg transition hover:border-brand-500/20 hover:bg-slate-900"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    {/* Customer Name */}
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-brand-400" />
                      <h3 className="text-lg font-semibold text-white">
                        {feedback.name}
                      </h3>
                    </div>

                    {/* Rating Stars */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              feedback.rating && star <= feedback.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-yellow-400">
                        {feedback.rating ? `${feedback.rating}/5` : "No rating"}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="mt-2 flex items-center gap-2">
                      <Mail size={16} className="text-slate-400" />
                      <p className="text-sm text-slate-400">{feedback.email}</p>
                    </div>

                    {/* Message */}
                    <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/50 p-4">
                      <p className="text-sm leading-7 text-slate-300">
                        {feedback.message}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-3 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-500" />
                      <p className="text-xs text-slate-500">
                        {new Date(feedback.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewFeedbacks;
