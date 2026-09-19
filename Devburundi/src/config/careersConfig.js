/**
 * ============================================================
 *  CAREERS APPLICATION FORM — CONFIG
 *  Devburundi Digital Marketing Agency
 * ============================================================
 */

export const careersConfig = {
    organizationName: "Devburundi Digital Marketing Agency",

    recipientEmail: "beckyherve@gmail.com",

    positions: [
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "UI/UX Designer",
        "Project Manager",
        "Digital Marketing Specialist",
        "Content Creator",
        "Data Analyst",
        "Other",
    ],

    // Languages offered as checkboxes. "Other" reveals a free-text input.
    languages: ["English", "Français", "Kirundi", "Kiswahili"],

    maxFileBytes: 10 * 1024 * 1024, // 10 MB
    acceptCv: ".pdf,.doc,.docx",
    acceptPortfolio: ".pdf,.png,.jpg,.jpeg,.webp,.zip",
};

export default careersConfig;