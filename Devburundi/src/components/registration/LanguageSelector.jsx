import React, { useState, useRef, useEffect } from "react";
import { Check, Globe } from "lucide-react";
import { languages } from "@/i18n/translations";

/**
 * LanguageSelector — top-right corner dropdown.
 * Instant switching, no page reload.
 */
export default function LanguageSelector({ current, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const active = languages.find((l) => l.code === current) || languages[0];

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="group flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:shadow-black/20"
            >
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span className="text-base leading-none">{active.flag}</span>
                <span className="hidden sm:inline">{active.label}</span>
            </button>

            {open && (
                <div
                    role="listbox"
                    className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/20 bg-black/70 py-1 shadow-2xl backdrop-blur-xl"
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            role="option"
                            aria-selected={lang.code === current}
                            onClick={() => {
                                onChange(lang.code);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/15 ${lang.code === current ? "bg-white/10" : ""
                                }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <span className="text-base leading-none">{lang.flag}</span>
                                {lang.label}
                            </span>
                            {lang.code === current && <Check className="h-4 w-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}