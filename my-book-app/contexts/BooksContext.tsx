import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Book } from '../types/book';
import { api } from '../services/api';

interface BooksContextType {
    books: Book[];
    loading: boolean;
    refreshBooks: () => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function BooksProvider({ children }: { children: ReactNode }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshBooks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getBooks();
            setBooks(data);
        } catch (error) {
            console.error('Erreur lors du chargement des livres:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <BooksContext.Provider value={{ books, loading, refreshBooks }}>
            {children}
        </BooksContext.Provider>
    );
}

export function useBooks() {
    const context = useContext(BooksContext);
    if (context === undefined) {
        throw new Error('useBooks doit être utilisé dans un BooksProvider');
    }
    return context;
}