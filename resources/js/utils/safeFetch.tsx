// utils/safeFetch.ts
export const safeFetch = async (
    url: string,
    options: RequestInit = {},
): Promise<Response> => {
    // 1️⃣ Ensure CSRF cookie is fresh
    await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

    // 2️⃣ Get the token from the meta tag
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    if (!csrfToken) {
        throw new Error('CSRF token missing. Please refresh the page.');
    }

    // 3️⃣ Merge headers
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json',
        ...(options.headers || {}),
    };

    // 4️⃣ Make fetch request with credentials included
    const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    return res;
};
