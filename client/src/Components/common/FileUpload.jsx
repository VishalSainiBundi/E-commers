import React, { useRef, useState, useEffect } from "react";

/*
DropifyUpload.jsx

A reusable Dropify-style file upload React component using TailwindCSS.
Props are dynamic so this can be integrated into any form.

Props:
- id?: string
- name?: string
- multiple?: boolean
- accept?: string
- maxSize?: number
- maxFiles?: number
- initialFiles?: File[]
- showPreview?: boolean
- className?: string
- onFilesChange?: (files) => {}
- onError?: (message) => {}
- disabled?: boolean

Usage:
import DropifyUpload from './DropifyUpload.jsx'
<DropifyUpload name="photos" multiple accept="image/*" />
*/

export default function FileUpload({
  upload_status=false,
  id,
  name = "files",
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  initialFiles = [],
  showPreview = true,
  className = "",
  onFilesChange = () => {},
  onError = () => {},
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(
    ()=>{
      if(upload_status==true){
        setFiles([]);
      }
    },
    [upload_status]
  )

  useEffect(() => {
    if (initialFiles && initialFiles.length) {
      const normalized = initialFiles.map((f, i) => normalizeFile(f, i));
      setFiles(normalized);
      onFilesChange(normalized);
    }

    // cleanup object URLs on unmount
    return () => {
      files.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function normalizeFile(f, i) {
    if (f instanceof File) {
      return {
        id: `${f.name}-${f.size}-${i}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        previewUrl: f.type.startsWith("image/")
          ? URL.createObjectURL(f)
          : null,
      };
    }

    return {
      id: `initial-${i}`,
      file: null,
      name: f.name || `file-${i}`,
      size: f.size || 0,
      type: f.type || "application/octet-stream",
      previewUrl: f.previewUrl || null,
    };
  }

  function validateAndAddFiles(selectedFiles) {
    const arr = Array.from(selectedFiles || []);
    const errors = [];
    const allowed = [];

    for (let f of arr) {
      if (accept && !matchesAccept(f, accept)) {
        errors.push(`${f.name}: invalid file type`);
        continue;
      }
      if (maxSize && f.size > maxSize) {
        errors.push(`${f.name}: exceeds max size ${formatBytes(maxSize)}`);
        continue;
      }
      allowed.push(f);
    }

    if (!multiple && allowed.length > 1) {
      allowed.splice(1);
    }

    const willBeCount = files.length + allowed.length;
    if (maxFiles && willBeCount > maxFiles) {
      errors.push(`Too many files (max ${maxFiles})`);
      allowed.splice(maxFiles - files.length);
    }

    if (errors.length) {
      const msg = errors.join("; ");
      setErrorMsg(msg);
      onError(msg);
    }

    if (allowed.length) {
      const normalized = allowed.map((f, i) =>
        normalizeFile(f, `${Date.now()}-${i}`)
      );
      const next = multiple ? [...files, ...normalized] : [...normalized];
      setFiles(next);
      onFilesChange(next);
    }
  }

  function matchesAccept(file, acceptPattern) {
    const patterns = acceptPattern
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    for (let p of patterns) {
      if (p.startsWith(".")) {
        if (file.name.toLowerCase().endsWith(p.toLowerCase())) return true;
      } else if (p.endsWith("/*")) {
        const base = p.replace("/*", "");
        if (file.type.startsWith(base)) return true;
      } else {
        if (file.type === p) return true;
      }
    }
    return false;
  }

  function handleInputChange(e) {
    if (!e.target.files) return;
    validateAndAddFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndAddFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function removeFile(id) {
    const removed = files.find(f => f.id === id);
    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    const next = files.filter(f => f.id !== id);
    setFiles(next);
    onFilesChange(next);
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(1)} ${units[i]}`;
  }

  return (
    <>
      {errorMsg && (
        <div className="text-red-600 text-sm mb-2 font-medium">{errorMsg}</div>
      )}

      <div className={`dropify-upload ${className}`}>
        <label
          htmlFor={id}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative w-full rounded-lg border-2 border-dashed p-4 cursor-pointer transition-shadow ${
            isDragging
              ? "border-indigo-400 bg-indigo-50 shadow-lg"
              : "border-gray-200 bg-white"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          aria-disabled={disabled}
        >
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            disabled={disabled}
          />

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12M7 16a4 4 0 108 0M7 16h10"
                />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-700">
                Drag & drop files here, or{" "}
                <span className="text-indigo-600 underline">
                  click to browse
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {multiple
                  ? `Up to ${maxFiles} files • Max ${formatBytes(maxSize)} each`
                  : `Single file • Max ${formatBytes(maxSize)}`}
              </div>
            </div>

            <div className="text-right text-xs text-gray-400">
              {files.length}/{maxFiles}
            </div>
          </div>
        </label>

        {showPreview && files.length > 0 && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3">
            {files.map(f => (
              <div key={f.id} className="relative border rounded p-1 bg-white">
                {f.previewUrl ? (
                  <img
                    src={f.previewUrl}
                    alt={f.name}
                    className="object-cover w-full h-28 rounded"
                  />
                ) : (
                  <div className="flex items-center justify-center h-28 text-xs text-gray-600">
                    {f.name}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="absolute top-1 right-1 p-1 rounded bg-white/80 hover:bg-white text-red-600 shadow-sm"
                  aria-label={`Remove ${f.name}`}
                >
                  ✕
                </button>

                <div className="p-2 text-xs text-gray-600 truncate">
                  {f.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
