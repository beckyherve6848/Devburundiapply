/**
 * ============================================================
 *  REGISTRATION PORTAL — EASY CUSTOMIZATION CONFIG
 * ============================================================
 *  Devburundi Digital Marketing Agency
 * ============================================================
 */

export const config = {
    // ---- Organization Identity ----
    organizationName: "Devburundi Digital Marketing Agency",
    organizationShort: "Devburundi",

    // ---- Branding Assets ----
    logoUrl: "/logo.png",
    backgroundUrl: "/background.png",

    // ---- Submission Destinations ----
    recipientEmail: "beckyherve@gmail.com",
    whatsappNumber: "254705524616",

    // ---- Color Palette (monochrome luxury) ----
    colors: {
        primary: "#000000",
        secondary: "#FFFFFF",
        lightGray: "#E5E5E5",
        darkGray: "#2D2D2D",
    },

    // ---- Overlay opacity for readability (0-100) ----
    overlayOpacity: 65,

    // ---- Provinces & their communes (Bujumbura region) ----
    provinces: [
        {
            name: "Bujumbura Mairie",
            communes: ["Mukaza", "Muha", "Ntahangwa"],
        },
        {
            name: "Bujumbura Rural",
            communes: ["Kabezi", "Isale", "Mubimbi", "Mutambu", "Mugongo-Manga"],
        },
    ],
};

export default config;