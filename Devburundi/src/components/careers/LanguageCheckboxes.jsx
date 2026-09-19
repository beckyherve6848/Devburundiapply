import React from "react";
import { careersConfig } from "@/config/careersConfig";

/**
 * LanguageCheckboxes — multi-select with an "Other" option that reveals
 * a free-text input when checked.
 */
export default function LanguageCheckboxes({
    value = [],
    otherText = "",
    onChange,
    onOtherChange,
    error,
}) {
    const toggle = (lang) => {
        if (value.includes(lang)) onChange(value.filter((l) => l !== lang));
        else onChange([...value, lang]);
    };

    const options = [...careersConfig.languages, "Other"];

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-white/90">
                Languages spoken
                <span className="ml-0.5 text-white/70">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {options.map((lang) => {
                    const checked = value.includes(lang);
                    return (
                        <label
                            key={lang}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${checked
                                    ? "border-white bg-white text-black"
                                    : "border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggle(lang)}
                                className="h-4 w-4 accent-black"
                            />
                            {lang}
                        </label>
                    );
                })}
            </div>

            {value.includes("Other") && (
                <input
                    type="text"
                    value={otherText}
                    onChange={(e) => onOtherChange(e.target.value)}
                    placeholder="Specify language"
                    aria-label="Other language"
                    className="mt-1 h-12 w-full rounded-xl border border-white/25 bg-white/10 px-4 text-base font-semibold text-white placeholder:font-medium placeholder:text-white/40 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
            )}

            <div className="min-h-[1.25rem]">
                {error && <p className="text-xs font-semibold text-red-300">{error}</p>}
            </div>
        </div>
    );
}