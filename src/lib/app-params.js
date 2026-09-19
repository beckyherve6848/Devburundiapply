const isNode = typeof window === 'undefined';

const createMockStorage = () => {
    const data = new Map();
    return {
        getItem: (key) => data.get(key) || null,
        setItem: (key, value) => data.set(key, String(value)),
        removeItem: (key) => data.delete(key),
        clear: () => data.clear()
    };
};

const storage = isNode ? createMockStorage() : window.localStorage;

const toSnakeCase = (str) => {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
    if (isNode) {
        return defaultValue;
    }
    const storageKey = `app_${toSnakeCase(paramName)}`;
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get(paramName);
    if (removeFromUrl) {
        urlParams.delete(paramName);
        const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
            }${window.location.hash}`;
        window.history.replaceState({}, document.title, newUrl);
    }
    if (searchParam) {
        storage.setItem(storageKey, searchParam);
        return searchParam;
    }
    const storedValue = storage.getItem(storageKey);
    if (storedValue) {
        return storedValue;
    }
    if (defaultValue !== undefined && defaultValue !== null) {
        storage.setItem(storageKey, defaultValue);
        return defaultValue;
    }
    return null;
};

const getAppParams = () => {
    if (getAppParamValue("clear_access_token") === 'true') {
        storage.removeItem('app_access_token');
        storage.removeItem('token');
    }
    return {
        appId: getAppParamValue("app_id", { defaultValue: "devburundi" }),
        token: getAppParamValue("access_token", { removeFromUrl: true }),
        fromUrl: getAppParamValue("from_url", { defaultValue: typeof window !== 'undefined' ? window.location.href : undefined }),
        functionsVersion: getAppParamValue("functions_version", { defaultValue: "1.0.0" }),
        appBaseUrl: getAppParamValue("app_base_url", { defaultValue: "" }),
    };
};

export const appParams = {
    ...getAppParams()
};
