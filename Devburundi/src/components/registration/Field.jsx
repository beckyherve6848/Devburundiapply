import React from "react";

/**
 * Field — glassmorphism input with label, error, and success states.
 */
export default function Field({
    label,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    touched,
    autoComplete,
    required,
}) {
    const showError = touched && error;
    const isValid = touched && !error && value;

    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={name}
                className="text-sm font-semibold text-white/90"
            >
                {label}
                {required && <span className="ml-0.5 text-white/70">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={!!showError}
                className={`h-12 w-full rounded-xl border bg-white/10 px-4 text-base font-semibold text-white placeholder:font-medium placeholder:text-white/40 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${showError
                        ? "border-red-400/70 focus:ring-red-400/50"
                        : isValid
                            ? "border-white/50"
                            : "border-white/25 hover:border-white/40"
                    }`}
            />
            <div className="min-h-[1.25rem]">
                {showError && (
                    <p className="animate-[fadeIn_0.2s_ease-out] text-xs font-semibold text-red-300">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}