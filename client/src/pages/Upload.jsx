import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadCard from "../components/UploadCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { analyzeResume } from "../api/axios.js";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileSelected(selectedFile, err) {
    setError(err || null);
    setFile(selectedFile);
  }

  async function handleSubmit() {
    if (!file) {
      setError("Please select a PDF resume before continuing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeResume(file);
      navigate("/dashboard", { state: { analysis: data.analysis } });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Upload Your Resume
        </h1>
        <p className="mt-3 text-slate-500">
          We'll extract the text from your PDF and run a full AI-powered
          career analysis. Nothing is stored — everything runs locally.
        </p>
      </div>

      <UploadCard onFileSelected={handleFileSelected} error={error} />

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!file}
          className="rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-10 py-3.5 font-semibold text-white shadow-soft transition-transform enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyze Resume
        </button>
      </div>
    </div>
  );
}
