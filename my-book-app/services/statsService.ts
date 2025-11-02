import { Book } from '../types/book';

export interface Stats {
  totalBooks: number;
  readCount: number;
  unreadCount: number;
  favoritesCount: number;
  averageRating: number;
  booksByTheme: { theme: string; count: number }[];
  booksByYear: { year: number; count: number }[];
}

export const statsService = {

  async getServerStats(): Promise<Stats> {
    try {
      const response = await fetch('http://localhost:3000/stats');
      if (!response.ok) throw new Error('Erreur stats serveur');
      const serverStats = await response.json();
      
    
      return {
        ...serverStats,
        booksByTheme: serverStats.booksByTheme || [],
        booksByYear: serverStats.booksByYear || []
      };
    } catch (error) {
      throw error;
    }
  },


  calculateStats(books: Book[]): Stats {
    const totalBooks = books.length;
    const readCount = books.filter(b => b.read).length;
    const unreadCount = totalBooks - readCount;
    const favoritesCount = books.filter(b => b.favorite).length;
    
    const ratedBooks = books.filter(b => b.rating && b.rating > 0);
    const averageRating = ratedBooks.length > 0 
      ? ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
      : 0;

    const themeMap = new Map<string, number>();
    books.forEach(book => {
      const theme = book.theme || 'Sans thème';
      themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
    });
    const booksByTheme = Array.from(themeMap.entries()).map(([theme, count]) => ({
      theme,
      count
    })).sort((a, b) => b.count - a.count); 

    // Stats par année
    const yearMap = new Map<number, number>();
    books.forEach(book => {
      if (book.year) {
        yearMap.set(book.year, (yearMap.get(book.year) || 0) + 1);
      }
    });
    const booksByYear = Array.from(yearMap.entries()).map(([year, count]) => ({
      year,
      count
    })).sort((a, b) => a.year - b.year);

    return {
      totalBooks,
      readCount,
      unreadCount,
      favoritesCount,
      averageRating: Number(averageRating.toFixed(2)),
      booksByTheme: booksByTheme || [], 
      booksByYear: booksByYear || []    
    };
  }
};