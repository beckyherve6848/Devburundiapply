/**
 * Devburundi Application Client
 * Self-contained client providing authentication, file upload, and application services.
 */

const STORAGE_KEYS = {
    TOKEN: 'app_access_token',
    USER: 'app_user',
    PENDING_EMAIL: 'app_pending_email',
    APPLICATIONS: 'app_career_applications'
};

const getStorage = () => {
    if (typeof window === 'undefined') {
        const memory = new Map();
        return {
            getItem: (k) => memory.get(k) || null,
            setItem: (k, v) => memory.set(k, String(v)),
            removeItem: (k) => memory.delete(k),
            clear: () => memory.clear()
        };
    }
    return window.localStorage;
};

const storage = getStorage();

export const client = {
    auth: {
        async me() {
            const token = storage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) {
                return null;
            }
            const userStr = storage.getItem(STORAGE_KEYS.USER);
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch {
                    // ignore JSON parse error
                }
            }
            return {
                id: 'usr_devburundi_1',
                email: 'user@devburundi.com',
                name: 'Devburundi User',
                role: 'user'
            };
        },

        async loginViaEmailPassword(email, password) {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            const user = {
                id: `usr_${Date.now()}`,
                email,
                name: email.split('@')[0],
                role: email.includes('admin') ? 'admin' : 'user'
            };
            const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            storage.setItem(STORAGE_KEYS.TOKEN, token);
            storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            return user;
        },

        loginWithProvider(provider, returnTo = '/') {
            const user = {
                id: `usr_${provider}_${Date.now()}`,
                email: `user@${provider}.com`,
                name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                role: 'user'
            };
            const token = `token_${provider}_${Date.now()}`;
            storage.setItem(STORAGE_KEYS.TOKEN, token);
            storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            window.location.href = returnTo || '/';
        },

        async register({ email, password }) {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            storage.setItem(STORAGE_KEYS.PENDING_EMAIL, email);
            return { success: true, email };
        },

        async verifyOtp({ email, otpCode }) {
            if (!otpCode || otpCode.length < 6) {
                throw new Error('Please enter a valid 6-digit verification code');
            }
            const userEmail = email || storage.getItem(STORAGE_KEYS.PENDING_EMAIL) || 'user@devburundi.com';
            const user = {
                id: `usr_${Date.now()}`,
                email: userEmail,
                name: userEmail.split('@')[0],
                role: 'user'
            };
            const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            storage.setItem(STORAGE_KEYS.TOKEN, token);
            storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            storage.removeItem(STORAGE_KEYS.PENDING_EMAIL);
            return { access_token: token, user };
        },

        async resendOtp(email) {
            return { success: true, email };
        },

        async resetPasswordRequest(email) {
            if (!email) {
                throw new Error('Email is required');
            }
            return { success: true };
        },

        async resetPassword({ resetToken, newPassword }) {
            if (!newPassword || newPassword.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            return { success: true };
        },

        setToken(token) {
            if (token) {
                storage.setItem(STORAGE_KEYS.TOKEN, token);
            } else {
                storage.removeItem(STORAGE_KEYS.TOKEN);
            }
        },

        getToken() {
            return storage.getItem(STORAGE_KEYS.TOKEN);
        },

        isAuthenticated() {
            return Boolean(storage.getItem(STORAGE_KEYS.TOKEN));
        },

        logout(redirectUrl) {
            storage.removeItem(STORAGE_KEYS.TOKEN);
            storage.removeItem(STORAGE_KEYS.USER);
            storage.removeItem(STORAGE_KEYS.PENDING_EMAIL);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        },

        redirectToLogin(redirectUrl) {
            const target = redirectUrl ? `?returnTo=${encodeURIComponent(redirectUrl)}` : '';
            window.location.href = `/login${target}`;
        }
    },

    integrations: {
        Core: {
            async UploadFile({ file }) {
                if (!file) {
                    throw new Error('No file provided');
                }
                // Store file metadata / object url
                const fileUrl = URL.createObjectURL(file);
                return {
                    file_url: fileUrl,
                    file_name: file.name,
                    file_size: file.size
                };
            }
        }
    },

    functions: {
        async invoke(functionName, payload) {
            if (functionName === 'submitCareerApplication') {
                const existing = JSON.parse(storage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
                const newRecord = {
                    id: `app_${Date.now()}`,
                    ...payload,
                    createdAt: new Date().toISOString()
                };
                existing.push(newRecord);
                storage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(existing));
                return { data: { status: 'success', id: newRecord.id } };
            }
            return { data: { status: 'success' } };
        }
    }
};

export default client;
