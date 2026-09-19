import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Mail, ExternalLink } from "lucide-react";
import { careersConfig } from "@/config/careersConfig";

/**
 * SuccessModal — premium animated success notification with Gmail confirmation.
 */
export default function SuccessModal({ open, onClose, onAnother, lastSubmission }) {
    const openGmail = () => {
        const subject = encodeURIComponent(`Career Application: ${lastSubmission?.position || "Application"} - ${lastSubmission?.fullName || ""}`);
        const body = encodeURIComponent(
            `CAREER APPLICATION - ${careersConfig.organizationName}\n\n` +
            `Full Name: ${lastSubmission?.fullName || ""}\n` +
            `Email: ${lastSubmission?.email || ""}\n` +
            `Phone: ${lastSubmission?.phone || ""}\n` +
            `Position: ${lastSubmission?.position || ""}\n` +
            `Languages: ${(lastSubmission?.languages || []).join(", ")}\n` +
            `${lastSubmission?.message ? `Message:\n${lastSubmission.message}\n` : ""}`
        );
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(careersConfig.recipientEmail)}&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 280, damping: 24 }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="success-title"
                        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 text-center shadow-2xl"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10"
                        >
                            <CheckCircle2 className="h-12 w-12 text-emerald-400" strokeWidth={1.8} />
                        </motion.div>

                        <h3 id="success-title" className="text-2xl font-extrabold text-white">
                            Application submitted successfully!
                        </h3>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-white/70">
                            Thank you for applying to {careersConfig.organizationName}.
                        </p>
                        
                        <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-3 text-left">
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Sent to</p>
                            <p className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                                <Mail className="h-4 w-4 text-emerald-400" />
                                {careersConfig.recipientEmail}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={openGmail}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Open in Gmail
                            </button>
                            <button
                                type="button"
                                onClick={onAnother}
                                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10"
                            >
                                Submit another application
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}