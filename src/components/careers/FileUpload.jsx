import React, { useRef, useState } from "react";
import { Upload, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { client } from "@/api/client";
import { careersConfig } from "@/config/careersConfig";

/**
 * FileUpload — glassmorphism file picker with animated upload progress.
 * Reports the resulting file_url back through onChange.
 */
export default function FileUpload({
    label,
    accept,
    required = false,
    value,
    fileName,
    error,
    onChange,
    onClear,
}) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [localError, setLocalError] = useState("");

    const formatBytes = (b) => {
        if (b < 1024) return `${b} B`;
        if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
        return `${(b / 1024 / 1024).toFixed(0)} MB`;
    };

    const handleFile = async (file) => {
        setLocalError("");
        if (!file) return;
        if (file.size > careersConfig.maxFileBytes) {
            setLocalError(`File too large (max ${formatBytes(careersConfig.maxFileBytes)})`);
            return;
        }
        setUploading(true);
        setProgress(0);
        let p = 0;
        const timer = setInterval(() => {
            p = Math.min(p + Math.random() * 16, 92);
            setProgress(Math.round(p));
        }, 160);
        try {
            const res = await client.integrations.Core.UploadFile({ file });
            clearInterval(timer);
            setProgress(100);
            onChange?.(res.file_url, file.name);
        } catch (e) {
            clearInterval(timer);
            setLocalError("Upload failed. Please try again.");
            setProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const clear = () => {
        if (inputRef.current) inputRef.current.value = "";
        setProgress(0);
        setLocalError("");
        onClear?.();
    };

    const showErr = localError || error;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-white/90">
                {label}
                {required && <span className="ml-0.5 text-white/70">*</span>}
            </label>

            {!value && !uploading && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/30 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                >
                    <Upload className="h-5 w-5" />
                    <span className="text-sm font-semibold">Click to upload</span>
                    <span className="text-xs font-medium text-white/40">
                        {accept ? accept.replace(/\./g, "").toUpperCase() : "Files"} • max {formatBytes(careersConfig.maxFileBytes)}
                    </span>
                </button>
            )}

            {uploading && (
                <div className="flex h-24 flex-col justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading… {progress}%
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                        <div
                            className="h-full rounded-full bg-white transition-all duration-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {value && !uploading && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-md">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                        <FileText className="h-4 w-4 shrink-0 text-white/70" />
                        <span className="truncate text-sm font-semibold text-white">
                            {fileName || "File uploaded"}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={clear}
                        aria-label="Remove file"
                        className="shrink-0 rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <div className="min-h-[1.25rem]">
                {showErr && <p className="text-xs font-semibold text-red-300">{showErr}</p>}
            </div>
        </div>
    );
}