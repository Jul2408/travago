export const getImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const API_HOST = 'http://localhost:8000';

    // Normalize path: ensure it doesn't have double slashes if prepended
    let cleanPath = path.startsWith('/') ? path : `/${path}`;

    // If it already starts with /media/, just prepend the host
    if (cleanPath.startsWith('/media/')) {
        return `${API_HOST}${cleanPath}`;
    }

    // Otherwise, prepend /media/ and the host
    return `${API_HOST}/media${cleanPath}`;
};
