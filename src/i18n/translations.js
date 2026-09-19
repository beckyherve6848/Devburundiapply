/**
 * ============================================================
 *  TRANSLATIONS — English / Français / Kirundi
 * ============================================================
 *  Add or edit strings here. Keys must stay consistent across
 *  all three language objects.
 * ============================================================
 */

export const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "rn", label: "Kirundi", flag: "🇧🇮" },
];

export const translations = {
    en: {
        header: {
            welcome: "Welcome to the official registration portal",
            title: "Registration Form",
            subtitle: "Please complete the form below to register.",
        },
        form: {
            personalInfo: "Personal Information",
            firstName: "First Name",
            secondName: "Second Name",
            email: "Email Address",
            contact: "Contact Number",
            gender: "Gender",
            commune: "Bujumbura Commune",
            province: "Province",
            selectProvince: "Select a province",
            male: "Male",
            female: "Female",
            quarter: "Quarter (Quartier)",
            age: "Age",
            address: "Address",
            avenueRoad: "Avenue / Road",
            language: "Languages spoken",
            selectLanguages: "Select all that apply",
            searchCommune: "Search commune...",
            selectCommune: "Select a commune",
            selectGender: "Select gender",
            sendEmail: "Send by Email",
            sendWhatsapp: "Send via WhatsApp",
            submitting: "Preparing...",
            required: "This field is required",
            invalidEmail: "Please enter a valid email address",
            invalidPhone: "Please enter a valid phone number",
        },
        success: {
            title: "Thank you!",
            message: "Your registration details are ready to be sent.",
            registerAnother: "Register another person",
        },
        whatsapp: {
            title: "Registration Form",
        },
    },

    fr: {
        header: {
            welcome: "Bienvenue sur le portail d'inscription officiel",
            title: "Formulaire d'inscription",
            subtitle: "Veuillez remplir le formulaire ci-dessous pour vous inscrire.",
        },
        form: {
            personalInfo: "Informations personnelles",
            firstName: "Prénom",
            secondName: "Nom",
            email: "Adresse e-mail",
            contact: "Numéro de contact",
            gender: "Genre",
            commune: "Commune de Bujumbura",
            province: "Province",
            selectProvince: "Sélectionner une province",
            male: "Homme",
            female: "Femme",
            quarter: "Quartier",
            age: "Âge",
            address: "Adresse",
            avenueRoad: "Avenue / Route",
            language: "Langues parlées",
            selectLanguages: "Cochez toutes les langues parlées",
            searchCommune: "Rechercher une commune...",
            selectCommune: "Sélectionner une commune",
            selectGender: "Sélectionner le genre",
            sendEmail: "Envoyer par e-mail",
            sendWhatsapp: "Envoyer via WhatsApp",
            submitting: "Préparation...",
            required: "Ce champ est obligatoire",
            invalidEmail: "Veuillez saisir une adresse e-mail valide",
            invalidPhone: "Veuillez saisir un numéro de téléphone valide",
        },
        success: {
            title: "Merci !",
            message: "Vos informations d'inscription sont prêtes à être envoyées.",
            registerAnother: "Inscrire une autre personne",
        },
        whatsapp: {
            title: "Formulaire d'inscription",
        },
    },

    rn: {
        header: {
            welcome: "Murakaza neza ku rwego rw'iyandikisho ryemewe",
            title: "Ifishi yo kwiyandikisha",
            subtitle: "Nyamwiza uzuzze iyi fishi hepfo mu kwiyandikisha.",
        },
        form: {
            personalInfo: "Amakuru y'umuntu",
            firstName: "Izina rya mbere",
            secondName: "Izina ry'umuryango",
            email: "Aderesi ya email",
            contact: "Telefone yo guhamagara",
            gender: "Igitsina",
            commune: "Komine ya Bujumbura",
            province: "Intara",
            selectProvince: "Hitamo intara",
            male: "Gabo",
            female: "Bagore",
            quarter: "Akagari (Quartier)",
            age: "Imyaka",
            address: "Aderesi",
            avenueRoad: "Avenue / Umuhanda",
            language: "Indimi uravuga",
            selectLanguages: "Hitamo zose uzivuga",
            searchCommune: "Shakisha komine...",
            selectCommune: "Hitamo komine",
            selectGender: "Hitamo igitsina",
            sendEmail: "Ohereza ku email",
            sendWhatsapp: "Ohereza kuri WhatsApp",
            submitting: "Tegura...",
            required: "Iki kibazo kiringenwe",
            invalidEmail: "Nyamwiza andika email y'ukuri",
            invalidPhone: "Nyamwiza andika telefone y'ukuri",
        },
        success: {
            title: "Murakoze!",
            message: "Amakuru yawe yo kwiyandikisha yabereye yo kohereza.",
            registerAnother: "Kwiyandikisha undi muntu",
        },
        whatsapp: {
            title: "Ifishi yo kwiyandikisha",
        },
    },
};

export const defaultLang = "en";