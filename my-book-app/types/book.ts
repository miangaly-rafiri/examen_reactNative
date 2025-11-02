export interface Book {
    id: string;
    name: string;
    author: string;
    editor: string;
    read: boolean;
    favorite: boolean;
    theme?: string;
    year: number;
    rating?: number;
    cover?: string; 
}

export interface BookFormData {
    name: string;
    author: string;
    editor: string;
    theme?: string;
    read?: boolean;
    favorite?: boolean;
    year: number;
    rating?: number;
    cover?: string; 
}

export interface BooksContextType {
  books: Book[];
  loading: boolean;
  refreshBooks: () => Promise<void>;
  createBook: (book: BookFormData) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  isOnline: boolean; // ← AJOUTE CETTE LIGNE
  syncPending: boolean; // ← ET CELLE-CI SI TU L'UTILISES
}