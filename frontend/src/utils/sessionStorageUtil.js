// src/utils/sessionStorageUtil.js
export const setItem = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key) => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

export const removeItem = (key) => {
    sessionStorage.removeItem(key);
};
