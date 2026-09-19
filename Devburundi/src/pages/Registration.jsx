import React, { useState } from "react";
import { config } from "@/config/registrationConfig";
import { translations, defaultLang } from "@/i18n/translations";
import LanguageSelector from "@/components/registration/LanguageSelector";
import RegistrationForm from "@/components/registration/RegistrationForm";

/**
 * Registration — premium glassmorphism landing + form page.
 * No backend. Pure client-side, instant language switching.
 */
export default function Registration() {
    const [lang, setLang] = useState(defaultLang);
    const t = translations[lang];

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background image */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${config.backgroundUrl}')` }}
                aria-hidden="true"
            />
            {/* Dark overlay for readability */}
            <div
                className="fixed inset-0 -z-10 bg-black"
                style={{ opacity: config.overlayOpacity / 100 }}
                aria-hidden="true"
            />

            {/* Header */}
            <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                    <img
                        src={config.logoUrl}
                        alt={`${config.organizationName} logo`}
                        className="h-12 w-auto rounded-lg object-contain sm:h-14"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback");
                            if (fallback) fallback.classList.remove("hidden");
                        }}
                    />
                    <span
                        className="logo-fallback hidden text-sm font-extrabold text-white"
                    >
                        {config.organizationShort}
                    </span>
                </div>
                <LanguageSelector current={lang} onChange={setLang} />
            </header>

            {/* Card */}
            <main className="mx-auto flex max-w-3xl flex-col px-5 pb-16 sm:px-8">
                <div className="animate-[fadeInUp_0.6s_ease-out] rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-3xl">
                    {/* Card header */}
                    <div className="px-6 pt-8 text-center sm:px-10">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                            {t.header.welcome}
                        </p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            {t.header.title}
                        </h1>
                        <p className="mx-auto mt-2 max-w-md text-sm font-medium text-white/70">
                            {t.header.subtitle}
                        </p>
                    </div>

                    {/* Form */}
                    <RegistrationForm t={t} />
                </div>

                <p className="mt-6 text-center text-xs font-medium text-white/50">
                    {config.organizationName}
                </p>
            </main>
        </div>
    );
}