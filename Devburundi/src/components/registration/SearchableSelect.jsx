import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

/**
 * SearchableSelect — accessible searchable dropdown.
 * Used for the Bujumbura commune list, but generic enough to reuse.
 *
 * Props:
 *  - options: string[]
 *  - value: string
 *  - onChange: (value) => void
 *  - placeholder: string (selected state)
 *  - searchPlaceholder: string
 *  - error?: boolean
 */
export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    error,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const filtered = options.filter((o) =>
        o.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white/10 px-4 text-left text-white backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${error
                        ? "border-red-400/70"
                        : "border-white/25 hover:border-white/40"
                    }`}
            >
                <span className={value ? "font-semibold" : "font-medium text-white/50"}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-white/70 transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/20 bg-black/75 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2 border-b border-white/15 px-3 py-2.5">
                        <Search className="h-4 w-4 text-white/50" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/40 focus:outline-none"
                        />
                    </div>
                    <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
                        {filtered.length === 0 && (
                            <li className="px-4 py-3 text-sm font-medium text-white/50">
                                —
                            </li>
                        )}
                        {filtered.map((opt) => (
                            <li key={opt}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={opt === value}
                                    onClick={() => {
                                        onChange(opt);
                                        setOpen(false);
                                        setQuery("");
                                    }}
                                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/15 ${opt === value ? "bg-white/10" : ""
                                        }`}
                                >
                                    {opt}
                                    {opt === value && <Check className="h-4 w-4" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}