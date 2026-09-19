import React, { useState } from "react";
import { Mail, CheckCircle2, User, RefreshCw, Check, ExternalLink } from "lucide-react";

/** Official WhatsApp glyph (brand mark, not available in Lucide). */
function WhatsAppIcon({ className = "" }) {
    return (
        <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
            <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.73 6.39L3.2 28.8l6.56-1.72a12.7 12.7 0 0 0 6.24 1.59h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.72 12.72 0 0 0 16.004 3.2zm0 23.04h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.89 1.02 1.04-3.79-.25-.39a10.56 10.56 0 0 1-1.62-5.62c0-5.85 4.77-10.62 10.63-10.62 2.84 0 5.5 1.11 7.5 3.12a10.53 10.53 0 0 1 3.11 7.5c0 5.86-4.77 10.62-10.62 10.62zm5.82-7.94c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37z" />
        </svg>
    );
}
import { config } from "@/config/registrationConfig";
import Field from "./Field";

/** Languages offered (endonyms — recognized across all UI languages). */
const LANGUAGE_OPTIONS = ["English", "Français", "Kirundi", "Swahili"];

/**
 * RegistrationForm — client-side only.
 * Validates in real time and prepares Email (Gmail & mailto:) / WhatsApp (wa.me) messages.
 *
 * `t` = active translation object.
 */
export default function RegistrationForm({ t }) {
    const [values, setValues] = useState({
        firstName: "",
        secondName: "",
        email: "",
        contact: "",
        gender: "",
        age: "",
        address: "",
        province: "",
        quarter: "",
        avenueRoad: "",
        languages: [],
    });
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(null); // "email" | "whatsapp" | null
    const [done, setDone] = useState(false);
    const [doneVia, setDoneVia] = useState(null);
    const [lastBody, setLastBody] = useState("");
    const [lastSubject, setLastSubject] = useState("");

    const set = (name, val) => setValues((v) => ({ ...v, [name]: val }));
    const blur = (name) => setTouched((tr) => ({ ...tr, [name]: true }));

    // ---- Validation ----
    const errors = {};
    if (!values.firstName.trim()) errors.firstName = t.form.required;
    if (!values.secondName.trim()) errors.secondName = t.form.required;
    if (!values.email.trim()) errors.email = t.form.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        errors.email = t.form.invalidEmail;
    if (!values.contact.trim()) errors.contact = t.form.required;
    else if (!/^[+]?[\d\s()-]{6,20}$/.test(values.contact))
        errors.contact = t.form.invalidPhone;
    if (!values.gender) errors.gender = t.form.required;
    if (!values.age.trim()) errors.age = t.form.required;
    else if (!/^\d{1,3}$/.test(values.age) || +values.age < 1 || +values.age > 120)
        errors.age = t.form.required;
    if (!values.address.trim()) errors.address = t.form.required;
    if (!values.province) errors.province = t.form.required;
    if (!values.quarter.trim()) errors.quarter = t.form.required;
    if (!values.avenueRoad.trim()) errors.avenueRoad = t.form.required;
    if (!values.languages.length) errors.languages = t.form.required;

    const isValid = Object.keys(errors).length === 0;

    const validateAll = () => {
        setTouched({
            firstName: true,
            secondName: true,
            email: true,
            contact: true,
            gender: true,
            age: true,
            address: true,
            province: true,
            quarter: true,
            avenueRoad: true,
            languages: true,
        });
        return isValid;
    };

    // ---- Message builders ----
    const buildBody = () => {
        const lines = [
            `NEW REGISTRATION - DEVBURUNDI`,
            "------------------------------------",
            `${t.form.firstName}: ${values.firstName}`,
            `${t.form.secondName}: ${values.secondName}`,
            `${t.form.email}: ${values.email}`,
            `${t.form.contact}: ${values.contact}`,
            `${t.form.gender}: ${values.gender}`,
            `${t.form.age}: ${values.age}`,
            `${t.form.address}: ${values.address}`,
            `${t.form.province}: ${values.province}`,
            `${t.form.quarter}: ${values.quarter}`,
            `${t.form.avenueRoad}: ${values.avenueRoad}`,
            `${t.form.language}: ${values.languages.join(", ")}`,
            "------------------------------------",
            `Recipient: ${config.recipientEmail}`,
        ];
        return lines.join("\n");
    };

    const handleSubmit = (mode) => {
        if (!validateAll()) return;
        setSubmitting(mode);
        const body = buildBody();
        const subject = `${t.whatsapp?.title || "Registration Form"} — ${values.firstName} ${values.secondName}`;
        setLastBody(body);
        setLastSubject(subject);

        setTimeout(() => {
            if (mode === "email") {
                const encodedSubject = encodeURIComponent(subject);
                const encodedBody = encodeURIComponent(body);
                const recipient = config.recipientEmail;

                // Open Gmail compose directly in new tab
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodedSubject}&body=${encodedBody}`;
                const mailto = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

                const opened = window.open(gmailUrl, "_blank");
                if (!opened || opened.closed || typeof opened.closed === "undefined") {
                    window.location.href = mailto;
                }
            } else {
                const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(body)}`;
                window.open(wa, "_blank", "noopener,noreferrer");
            }
            setSubmitting(null);
            setDoneVia(mode);
            setDone(true);
        }, 500);
    };

    const reset = () => {
        setValues({
            firstName: "",
            secondName: "",
            email: "",
            contact: "",
            gender: "",
            age: "",
            address: "",
            province: "",
            quarter: "",
            avenueRoad: "",
            languages: [],
        });
        setTouched({});
        setDone(false);
        setDoneVia(null);
    };

    const openGmail = () => {
        const encodedSubject = encodeURIComponent(lastSubject);
        const encodedBody = encodeURIComponent(lastBody);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(config.recipientEmail)}&su=${encodedSubject}&body=${encodedBody}`;
        window.open(gmailUrl, "_blank");
    };

    const openMailto = () => {
        const encodedSubject = encodeURIComponent(lastSubject);
        const encodedBody = encodeURIComponent(lastBody);
        window.location.href = `mailto:${config.recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    };

    // ---- Success state ----
    if (done) {
        return (
            <div className="flex flex-col items-center gap-5 px-6 py-12 text-center">
                <div className="animate-[fadeIn_0.3s_ease-out]">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{t.success.title}</h3>
                <p className="max-w-md text-base font-medium text-white/80">
                    {t.success.message}
                </p>

                <div className="w-full max-w-md rounded-xl border border-white/20 bg-white/5 p-4 text-left backdrop-blur-md">
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">Destination</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                        <Mail className="h-4 w-4 text-emerald-400" />
                        {config.recipientEmail}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 mt-2">
                    <button
                        type="button"
                        onClick={openGmail}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-white/90"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open Gmail
                    </button>
                    <button
                        type="button"
                        onClick={openMailto}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
                    >
                        <Mail className="h-4 w-4" />
                        Mail App
                    </button>
                </div>

                <button
                    type="button"
                    onClick={reset}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {t.success.registerAnother}
                </button>
            </div>
        );
    }

    // ---- Form ----
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("email");
            }}
            className="flex flex-col gap-6 px-6 py-8 sm:px-10"
            noValidate
        >
            {/* Personal Information */}
            <section>
                <div className="mb-4 flex items-center gap-2.5">
                    <User className="h-5 w-5 text-white/80" />
                    <h2 className="text-lg font-bold text-white">{t.form.personalInfo}</h2>
                </div>
                <div className="grid grid-cols-1 gap-x-5 gap-y-1 sm:grid-cols-2">
                    <Field
                        label={t.form.firstName}
                        name="firstName"
                        value={values.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        onBlur={() => blur("firstName")}
                        placeholder={t.form.firstName}
                        error={errors.firstName}
                        touched={touched.firstName}
                        required
                        autoComplete="given-name"
                    />
                    <Field
                        label={t.form.secondName}
                        name="secondName"
                        value={values.secondName}
                        onChange={(e) => set("secondName", e.target.value)}
                        onBlur={() => blur("secondName")}
                        placeholder={t.form.secondName}
                        error={errors.secondName}
                        touched={touched.secondName}
                        required
                        autoComplete="family-name"
                    />
                    <Field
                        label={t.form.email}
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => set("email", e.target.value)}
                        onBlur={() => blur("email")}
                        placeholder={t.form.email}
                        error={errors.email}
                        touched={touched.email}
                        required
                        autoComplete="email"
                    />
                    <Field
                        label={t.form.contact}
                        name="contact"
                        type="tel"
                        value={values.contact}
                        onChange={(e) => set("contact", e.target.value)}
                        onBlur={() => blur("contact")}
                        placeholder={t.form.contact}
                        error={errors.contact}
                        touched={touched.contact}
                        required
                        autoComplete="tel"
                    />
                    {/* Gender */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-white/90">
                            {t.form.gender}
                            <span className="ml-0.5 text-white/70">*</span>
                        </label>
                        <select
                            name="gender"
                            value={values.gender}
                            onChange={(e) => set("gender", e.target.value)}
                            onBlur={() => blur("gender")}
                            className={`h-12 w-full rounded-xl border bg-white/10 px-3 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${touched.gender && errors.gender
                                    ? "border-red-400/70"
                                    : "border-white/25 hover:border-white/40"
                                }`}
                        >
                            <option value="" disabled className="bg-black text-white">
                                {t.form.selectGender}
                            </option>
                            <option value={t.form.male} className="bg-black text-white">
                                {t.form.male}
                            </option>
                            <option value={t.form.female} className="bg-black text-white">
                                {t.form.female}
                            </option>
                        </select>
                        <div className="min-h-[1.25rem]">
                            {touched.gender && errors.gender && (
                                <p className="text-xs font-semibold text-red-300">
                                    {errors.gender}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Age */}
                    <Field
                        label={t.form.age}
                        name="age"
                        type="number"
                        value={values.age}
                        onChange={(e) => set("age", e.target.value)}
                        onBlur={() => blur("age")}
                        placeholder={t.form.age}
                        error={errors.age}
                        touched={touched.age}
                        required
                    />
                </div>
            </section>

            {/* Location & Languages */}
            <section className="grid grid-cols-1 gap-x-5 gap-y-1 sm:grid-cols-2">
                {/* Address */}
                <div className="sm:col-span-2">
                    <Field
                        label={t.form.address}
                        name="address"
                        value={values.address}
                        onChange={(e) => set("address", e.target.value)}
                        onBlur={() => blur("address")}
                        placeholder={t.form.address}
                        error={errors.address}
                        touched={touched.address}
                        required
                        autoComplete="street-address"
                    />
                </div>

                {/* Province */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-white/90">
                        {t.form.province}
                        <span className="ml-0.5 text-white/70">*</span>
                    </label>
                    <select
                        name="province"
                        value={values.province}
                        onChange={(e) => set("province", e.target.value)}
                        onBlur={() => blur("province")}
                        className={`h-12 w-full rounded-xl border bg-white/10 px-3 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${touched.province && errors.province
                                ? "border-red-400/70"
                                : "border-white/25 hover:border-white/40"
                            }`}
                    >
                        <option value="" disabled className="bg-black text-white">
                            {t.form.selectProvince}
                        </option>
                        {config.provinces.map((p) => (
                            <option key={p.name} value={p.name} className="bg-black text-white">
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <div className="min-h-[1.25rem]">
                        {touched.province && errors.province && (
                            <p className="text-xs font-semibold text-red-300">
                                {errors.province}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quarter */}
                <Field
                    label={t.form.quarter}
                    name="quarter"
                    value={values.quarter}
                    onChange={(e) => set("quarter", e.target.value)}
                    onBlur={() => blur("quarter")}
                    placeholder={t.form.quarter}
                    error={errors.quarter}
                    touched={touched.quarter}
                    required
                />

                {/* Avenue / Road */}
                <div className="sm:col-span-2">
                    <Field
                        label={t.form.avenueRoad}
                        name="avenueRoad"
                        value={values.avenueRoad}
                        onChange={(e) => set("avenueRoad", e.target.value)}
                        onBlur={() => blur("avenueRoad")}
                        placeholder={t.form.avenueRoad}
                        error={errors.avenueRoad}
                        touched={touched.avenueRoad}
                        required
                    />
                </div>

                {/* Languages */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-sm font-semibold text-white/90">
                        {t.form.language}
                        <span className="ml-0.5 text-white/70">*</span>
                    </label>
                    <p className="text-xs font-medium text-white/50">
                        {t.form.selectLanguages}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                        {LANGUAGE_OPTIONS.map((lang) => {
                            const selected = values.languages.includes(lang);
                            return (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() =>
                                        set(
                                            "languages",
                                            selected
                                                ? values.languages.filter((l) => l !== lang)
                                                : [...values.languages, lang]
                                        )
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${selected
                                            ? "border-white bg-white text-black"
                                            : "border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15"
                                        }`}
                                >
                                    {selected && <Check className="h-4 w-4" />}
                                    {lang}
                                </button>
                            );
                        })}
                    </div>
                    <div className="min-h-[1.25rem]">
                        {touched.languages && errors.languages && (
                            <p className="text-xs font-semibold text-red-300">
                                {errors.languages}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Submission buttons */}
            <section className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => handleSubmit("email")}
                    disabled={!isValid || !!submitting}
                    className="inline-flex h-[54px] flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#D1D5DB] bg-white px-6 text-sm font-bold text-black shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    <Mail className="h-5 w-5 text-black" strokeWidth={2.25} />
                    {submitting === "email" ? t.form.submitting : (t.form.sendEmail || "Send via Gmail")}
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit("whatsapp")}
                    disabled={!isValid || !!submitting}
                    className="inline-flex h-[54px] flex-1 items-center justify-center gap-2.5 rounded-2xl border border-transparent bg-[#25D366] px-6 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1DA851] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-[#25D366]"
                >
                    <WhatsAppIcon className="h-5 w-5 text-white" />
                    {submitting === "whatsapp" ? t.form.submitting : t.form.sendWhatsapp}
                </button>
            </section>
        </form>
    );
}