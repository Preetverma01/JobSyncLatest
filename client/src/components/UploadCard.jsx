import { useRef, useState } from "react";

export default function UploadCard({ onFileSelected, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;

    const isPdfFile =
      file.type === "application/pdf" ||
      file.name?.toLowerCase().endsWith(".pdf");

    if (!isPdfFile) {
      setSelectedFile(null);
      onFileSelected(null, "Please upload a PDF file.");
      return;
    }

    setSelectedFile(file);
    onFileSelected(file, null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all ${
          isDragging
            ? "border-brand-500 bg-brand-50 scale-[1.01]"
            : "border-brand-200 bg-white hover:border-brand-400 hover:bg-brand-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3"
            />
          </svg>
        </div>

        {selectedFile ? (
          <div>
            <p className="font-semibold text-slate-800">{selectedFile.name}</p>
            <p className="mt-1 text-sm text-slate-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click or drop to replace
            </p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-slate-800">
              Drag &amp; drop your resume here
            </p>
            <p className="mt-1 text-sm text-slate-400">
              or click to browse · PDF only · max 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-center text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
