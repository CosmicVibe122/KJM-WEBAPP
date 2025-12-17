
export default function apiFetch(path, options = {}) {
    const envBase = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) ? String(import.meta.env.VITE_API_BASE_URL).trim() : '';

    const cleanBase = envBase.replace(/\/$/, '');

   
    const isFullUrl = /^https?:\/\//i.test(path);

    let url;
    if (isFullUrl) {
        url = path;
    } else {
        const p = path.startsWith('/') ? path : `/${path}`;
        if (cleanBase) {
            url = `${cleanBase}${cleanBase.endsWith('/api') ? '' : '/api'}${p}`;
        } else {
            url = `/api${p}`;
        }
    }

    return fetch(url, options);
}
