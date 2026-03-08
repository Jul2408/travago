export const getImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Dynamically derive host from NEXT_PUBLIC_API_URL so images load in production
    let API_HOST = 'http://localhost:8000';
    try {
        if (process.env.NEXT_PUBLIC_API_URL) {
            API_HOST = new URL(process.env.NEXT_PUBLIC_API_URL).origin;
        }
    } catch {
        // Fallback safely if URL parsing fails
        API_HOST = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] || 'http://localhost:8000';
    }

    // Replace incorrect "http://127.0.0.1:8000" embedded in DB if it happens
    path = path.replace('http://127.0.0.1:8000', '').replace('http://localhost:8000', '');
    if (path.startsWith(API_HOST)) return path;

    let cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (cleanPath.startsWith('/media/')) {
        return `${API_HOST}${cleanPath}`;
    }

    return `${API_HOST}/media${cleanPath}`;
};
