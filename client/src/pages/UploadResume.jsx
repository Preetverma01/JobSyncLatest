import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import api from "../services/api";

export default function UploadResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard", { state: { analysis: response.data.analysis } });
    } catch (err) {
      setError(err.response?.data?.message || "Resume analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <UploadCloud size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Upload your resume</h1>
            <p className="text-sm text-slate-500">We’ll analyze it against your target role and generate a plan.</p>
          </div>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 px-6 py-10 text-center transition hover:border-brand-400">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <UploadCloud size={30} className="mb-3 text-brand-600" />
          <span className="font-semibold text-slate-800">
            {file ? file.name : "Choose a PDF resume file"}
          </span>
          <span className="mt-2 text-sm text-slate-500">PDF only · max 5MB</span>
        </label>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="mt-6 w-full rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-4 py-3 font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>
    </div>
  );
}
