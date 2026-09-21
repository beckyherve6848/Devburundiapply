import React, { useState } from "react";
import { Download, X, Smartphone, Zap, WifiOff, Share, PlusSquare, CheckCircle2, ArrowUpRight } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { translations, defaultLang } from "@/i18n/translations";
import { config } from "@/config/registrationConfig";

export default function PWAInstallPrompt({ currentLang }) {
    const [lang, setLang] = useState(() => currentLang || localStorage.getItem("devburundi_lang") || defaultLang);

    const {
        isOpen,
        isInstalled,
        isIOS,
        isDismissed,
        promptInstall,
        dismissPrompt,
        openPrompt
    } = usePWAInstall();

    const [isInstalling, setIsInstalling] = useState(false);

    // Synchronize language if prop changes or on global custom event
    React.useEffect(() => {
        if (currentLang) setLang(currentLang);
    }, [currentLang]);

    React.useEffect(() => {
        const handleLangChange = (e) => {
            if (e.detail) {
                setLang(e.detail);
            }
        };
        window.addEventListener("devburundi_lang_change", handleLangChange);
        return () => window.removeEventListener("devburundi_lang_change", handleLangChange);
    }, []);

    // Get current language strings or fallback to default
    const t = (translations[lang] || translations[defaultLang]).pwa || translations[defaultLang].pwa;

    // If app is already running as installed standalone, do not show prompt or floating button
    if (isInstalled) {
        return null;
    }

    const handleInstallClick = async () => {
        setIsInstalling(true);
        try {
            await promptInstall();
        } finally {
            setIsInstalling(false);
        }
    };

    return (
        <>
            {/* Modal Backdrop & Dialog */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pwa-dialog-title"
                >
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-[fadeIn_0.3s_ease-out]"
                        onClick={dismissPrompt}
                        aria-hidden="true"
                    />

                    {/* Card container */}
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-black/90 p-6 sm:p-8 text-white shadow-2xl shadow-black/80 backdrop-blur-2xl animate-[fadeInUp_0.35s_ease-out]">
                        {/* Ambient decorative glow */}
                        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-slate-500/10 blur-3xl" />

                        {/* Close button */}
                        <button
                            onClick={dismissPrompt}
                            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* App Branding Header */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-2 shadow-xl shadow-black/50 ring-1 ring-white/10">
                                    <img
                                        src={config.logoUrl}
                                        alt={config.organizationName}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-md ring-2 ring-black">
                                    <Smartphone className="h-3.5 w-3.5" />
                                </span>
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                                <Zap className="h-3 w-3 text-amber-300" />
                                {config.organizationShort} App
                            </span>

                            <h2 
                                id="pwa-dialog-title"
                                className="mt-3 text-2xl font-bold tracking-tight text-white"
                            >
                                {t.title}
                            </h2>

                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Features highlight */}
                        <div className="my-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                            <div className="flex flex-col items-center gap-1 p-1">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                    <Zap className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-medium text-white/80 leading-tight">
                                    {t.featureFast}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-1 border-x border-white/10">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                    <WifiOff className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-medium text-white/80 leading-tight">
                                    {t.featureOffline}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-1">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                    <Smartphone className="h-4 w-4" />
                                </div>
                                <span className="text-[11px] font-medium text-white/80 leading-tight">
                                    {t.featureHome}
                                </span>
                            </div>
                        </div>

                        {/* iOS Guided Instructions vs Standard One-Click Prompt */}
                        {isIOS ? (
                            <div className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-white/90">
                                <p className="font-semibold text-white flex items-center gap-2">
                                    <Share className="h-4 w-4 text-blue-400" />
                                    {t.iosTitle}
                                </p>
                                <ol className="space-y-2 pl-1 text-white/80">
                                    <li className="flex items-start gap-2">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                                            1
                                        </span>
                                        <span>{t.iosStep1}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                                            2
                                        </span>
                                        <span>{t.iosStep2}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                                            3
                                        </span>
                                        <span>{t.iosStep3}</span>
                                    </li>
                                </ol>
                                <button
                                    onClick={dismissPrompt}
                                    className="mt-3 w-full rounded-xl border border-white/20 bg-white py-2.5 text-center text-sm font-bold text-black shadow-lg transition-transform active:scale-[0.98] hover:bg-white/90"
                                >
                                    {t.laterBtn}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                <button
                                    onClick={handleInstallClick}
                                    disabled={isInstalling}
                                    className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-white via-slate-100 to-white px-5 py-3.5 text-sm font-bold text-black shadow-xl shadow-white/10 transition-all active:scale-[0.98] hover:bg-slate-200 disabled:opacity-70 cursor-pointer"
                                >
                                    <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                                    <span>{t.installBtn}</span>
                                </button>

                                <button
                                    onClick={dismissPrompt}
                                    className="w-full rounded-xl py-2.5 text-center text-xs font-semibold text-white/60 transition-colors hover:text-white"
                                >
                                    {t.laterBtn}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Persistent Floating Install Badge (shows when dismissed or minimized, so users can install whenever they want) */}
            {!isOpen && (
                <button
                    onClick={openPrompt}
                    aria-label="Install App"
                    className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-white/20 bg-black/85 px-4 py-2.5 text-xs font-semibold text-white shadow-xl shadow-black/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-black active:scale-95"
                >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                        <Download className="h-3 w-3" />
                    </div>
                    <span>{t.floatingInstall}</span>
                </button>
            )}
        </>
    );
}
