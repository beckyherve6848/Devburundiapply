import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { client } from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import { careersConfig } from "@/config/careersConfig";
import { config } from "@/config/registrationConfig";
import Field from "@/components/registration/Field";
import FileUpload from "@/components/careers/FileUpload";
import LanguageCheckboxes from "@/components/careers/LanguageCheckboxes";
import SuccessModal from "@/components/careers/SuccessModal";

const schema = z
    .object({
        fullName: z.string().min(2, "Please enter your full name"),
        email: z.string().email("Enter a valid email"),
        phone: z.string().min(6, "Enter a valid phone number"),
        position: z.string().min(1, "Select a position"),
        languages: z.array(z.string()).min(1, "Select at least one language"),
        otherLanguage: z.string().optional(),
        message: z.string().max(1000, "Message is too long").optional(),
        cv: z.string().min(1, "Upload your CV"),
        portfolio: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.languages.includes("Other") &&
            !(data.otherLanguage && data.otherLanguage.trim())
        ) {
            ctx.addIssue({
                path: ["otherLanguage"],
                message: "Specify the other language",
                code: z.ZodIssueCode.custom,
            });
        }
    });

export default function Careers() {
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cvName, setCvName] = useState("");
    const [portfolioName, setPortfolioName] = useState("");
    const [lastSubmission, setLastSubmission] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            position: "",
            languages: [],
            otherLanguage: "",
            message: "",
            cv: "",
            portfolio: "",
        },
    });

    const otherLanguage = watch("otherLanguage") || "";

    const onSubmit = async (data) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const res = await client.functions.invoke("submitCareerApplication", {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                position: data.position,
                languages: data.languages,
                otherLanguage: data.otherLanguage,
                message: data.message,
                cvUrl: data.cv,
                portfolioUrl: data.portfolio || "",
            });
            if (res?.data?.status === "success") {
                setLastSubmission(data);
                setSuccess(true);
                reset();
                setCvName("");
                setPortfolioName("");
            } else {
                throw new Error(res?.data?.error || "Submission failed");
            }
        } catch (err) {
            toast({
                title: "Submission failed",
                description: "Please try again in a few moments.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const selectClass = (hasError) =>
        `h-12 w-full rounded-xl border bg-white/10 px-3 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${hasError ? "border-red-400/70" : "border-white/25 hover:border-white/40"
        }`;

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${config.backgroundUrl}')` }}
                aria-hidden="true"
            />
            <div
                className="fixed inset-0 -z-10 bg-black"
                style={{ opacity: config.overlayOpacity / 100 }}
                aria-hidden="true"
            />

            {/* Header */}
            <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt={`${careersConfig.organizationName} logo`}
                        className="h-12 w-auto rounded-lg object-contain sm:h-14"
                    />
                    <div className="leading-tight">
                        <p className="text-base font-extrabold text-white">{careersConfig.organizationName}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Careers</p>
                    </div>
                </div>
            </header>

            {/* Card */}
            <main className="mx-auto flex max-w-3xl flex-col px-5 pb-16 sm:px-8">
                <div className="animate-[fadeInUp_0.6s_ease-out] rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:rounded-3xl">
                    <div className="px-6 pt-8 text-center sm:px-10">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                            Join our team
                        </p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Career Application
                        </h1>
                        <p className="mx-auto mt-2 max-w-md text-sm font-medium text-white/70">
                            Apply to {careersConfig.organizationName} — we'll review your profile and get in touch.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="flex flex-col gap-6 px-6 py-8 sm:px-10"
                    >
                        {/* Personal information */}
                        <section>
                            <h2 className="mb-4 text-lg font-bold text-white">Personal information</h2>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-1 sm:grid-cols-2">
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                        <Field
                                            label="Full name"
                                            name="fullName"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            placeholder="Full name"
                                            error={errors.fullName?.message}
                                            touched
                                            required
                                            autoComplete="name"
                                        />
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Field
                                            label="Email address"
                                            name="email"
                                            type="email"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            placeholder="Email address"
                                            error={errors.email?.message}
                                            touched
                                            required
                                            autoComplete="email"
                                        />
                                    )}
                                />
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Field
                                            label="Phone number"
                                            name="phone"
                                            type="tel"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            placeholder="Phone number"
                                            error={errors.phone?.message}
                                            touched
                                            required
                                            autoComplete="tel"
                                        />
                                    )}
                                />
                                <Controller
                                    name="position"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold text-white/90">
                                                Position
                                                <span className="ml-0.5 text-white/70">*</span>
                                            </label>
                                            <select
                                                name="position"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                aria-invalid={!!errors.position}
                                                className={selectClass(!!errors.position)}
                                            >
                                                <option value="" disabled className="bg-black text-white">
                                                    Select a position
                                                </option>
                                                {careersConfig.positions.map((p) => (
                                                    <option key={p} value={p} className="bg-black text-white">
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="min-h-[1.25rem]">
                                                {errors.position && (
                                                    <p className="text-xs font-semibold text-red-300">
                                                        {errors.position.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </section>

                        {/* Languages */}
                        <section>
                            <Controller
                                name="languages"
                                control={control}
                                render={({ field }) => (
                                    <LanguageCheckboxes
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        otherText={otherLanguage}
                                        onOtherChange={(v) =>
                                            setValue("otherLanguage", v, { shouldValidate: true })
                                        }
                                        error={errors.languages?.message || errors.otherLanguage?.message}
                                    />
                                )}
                            />
                        </section>

                        {/* Files */}
                        <section className="grid grid-cols-1 gap-x-5 gap-y-1">
                            <Controller
                                name="cv"
                                control={control}
                                render={({ field }) => (
                                    <FileUpload
                                        label="CV / Resume"
                                        accept={careersConfig.acceptCv}
                                        required
                                        value={field.value || ""}
                                        fileName={cvName}
                                        error={errors.cv?.message}
                                        onChange={(url, name) => {
                                            field.onChange(url);
                                            setCvName(name);
                                            clearErrors("cv");
                                        }}
                                        onClear={() => {
                                            field.onChange("");
                                            setCvName("");
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="portfolio"
                                control={control}
                                render={({ field }) => (
                                    <FileUpload
                                        label="Portfolio (optional)"
                                        accept={careersConfig.acceptPortfolio}
                                        value={field.value || ""}
                                        fileName={portfolioName}
                                        error={errors.portfolio?.message}
                                        onChange={(url, name) => {
                                            field.onChange(url);
                                            setPortfolioName(name);
                                        }}
                                        onClear={() => {
                                            field.onChange("");
                                            setPortfolioName("");
                                        }}
                                    />
                                )}
                            />
                        </section>

                        {/* Message */}
                        <section>
                            <Controller
                                name="message"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-white/90">
                                            Cover message <span className="text-white/50">(optional)</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            rows={4}
                                            maxLength={1000}
                                            placeholder="Tell us briefly why you're a great fit…"
                                            aria-invalid={!!errors.message}
                                            className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-base font-semibold text-white placeholder:font-medium placeholder:text-white/40 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                        <div className="min-h-[1.25rem]">
                                            {errors.message && (
                                                <p className="text-xs font-semibold text-red-300">
                                                    {errors.message.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            />
                        </section>

                        {/* Submit */}
                        <section>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-6 text-sm font-bold text-black shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" strokeWidth={2.25} />
                                        Submit application
                                    </>
                                )}
                            </button>
                        </section>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs font-medium text-white/50">
                    {careersConfig.organizationName} • Careers
                </p>
            </main>

            <SuccessModal
                open={success}
                lastSubmission={lastSubmission}
                onClose={() => setSuccess(false)}
                onAnother={() => setSuccess(false)}
            />
        </div>
    );
}