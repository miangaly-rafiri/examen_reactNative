const OPEN_LIBRARY_API = 'https://openlibrary.org';

export const getCoverUrl = (isbn: string) => {
    return `${OPEN_LIBRARY_API}/isbn/${isbn}.json`;
};

export const searchBooks = async (query: string) => {
    try {
        const response = await fetch(`${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.docs;
    } catch (error) {
        console.error('Erreur lors de la recherche OpenLibrary:', error);
        return [];
    }
};

export const getBookCoverUrl = (coverId: string, size: 'S' | 'M' | 'L' = 'M') => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};