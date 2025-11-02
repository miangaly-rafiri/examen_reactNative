// const OPEN_LIBRARY_API = 'https://openlibrary.org';

// export const getCoverUrl = (isbn: string) => {
//     return `${OPEN_LIBRARY_API}/isbn/${isbn}.json`;
// };

// export const searchBooks = async (query: string) => {
//     try {
//         const response = await fetch(`${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}`);
//         const data = await response.json();
//         return data.docs;
//     } catch (error) {
//         console.error('Erreur lors de la recherche OpenLibrary:', error);
//         return [];
//     }
// };

// export const getBookCoverUrl = (coverId: string, size: 'S' | 'M' | 'L' = 'M') => {
//     return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
// };

export interface OpenLibraryEdition {
  key: string;
  title: string;
  publish_date?: string[];
  isbn?: string[];
}

export interface OpenLibraryResponse {
  numFound: number;
  docs: OpenLibraryEdition[];
}

export const openLibraryService = {
  async searchBook(title: string): Promise<OpenLibraryResponse> {
    try {
      const encodedTitle = encodeURIComponent(title);
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodedTitle}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Erreur API OpenLibrary');
      }
      
      const data = await response.json();
      return {
        numFound: data.numFound,
        docs: data.docs || []
      };
    } catch (error) {
      console.error('Erreur recherche OpenLibrary:', error);
      throw error;
    }
  },

  async getBookCover(isbn: string, size: 'S' | 'M' | 'L' = 'M'): Promise<string | null> {
    try {
      const response = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`);
      if (response.ok) {
        return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
};