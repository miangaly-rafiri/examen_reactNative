// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { Book, BookFormData } from '../../types/book';
// import { api } from '../../services/api';
// import { offlineStorage } from '../../services/offlineStorage';
// import { Alert } from 'react-native';

// interface BooksContextType {
//   books: Book[];
//   loading: boolean;
//   refreshBooks: () => Promise<void>;
//   createBook: (book: BookFormData) => Promise<void>;
//   updateBook: (id: string, book: Partial<Book>) => Promise<void>;
//   deleteBook: (id: string) => Promise<void>;
//   isOnline: boolean;
//   syncPending: boolean;
// }

// const BooksContext = createContext<BooksContextType | undefined>(undefined);

// export function BooksProvider({ children }: { children: ReactNode }) {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isOnline, setIsOnline] = useState(true);
//   const [syncPending, setSyncPending] = useState(false);

//   // Vérifier la connexion et charger les données
//   useEffect(() => {
//     checkConnectionAndLoad();
//     const interval = setInterval(checkConnection, 30000); // Vérifier toutes les 30s
//     return () => clearInterval(interval);
//   }, []);

//   const checkConnectionAndLoad = async () => {
//     const online = await offlineStorage.isOnline();
//     setIsOnline(online);
    
//     if (online) {
//       await loadFromServer();
//       await syncOfflineChanges();
//     } else {
//       await loadFromStorage();
//       Alert.alert('Mode Hors Ligne', 'Vous êtes en mode hors ligne. Les modifications seront synchronisées lorsque la connexion sera rétablie.');
//     }
//   };

//   const checkConnection = async () => {
//     const online = await offlineStorage.isOnline();
//     setIsOnline(online);
//     if (online && !isOnline) {
//       // Connexion rétablie
//       await syncOfflineChanges();
//     }
//   };

//   const loadFromServer = async () => {
//     try {
//       setLoading(true);
//       const serverBooks = await api.getBooks();
//       setBooks(serverBooks);
//       await offlineStorage.saveBooks(serverBooks);
//     } catch (error) {
//       console.error('Erreur chargement serveur:', error);
//       await loadFromStorage();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadFromStorage = async () => {
//     try {
//       const localBooks = await offlineStorage.loadBooks();
//       setBooks(localBooks);
//     } catch (error) {
//       console.error('Erreur chargement local:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const syncOfflineChanges = async () => {
//     try {
//       setSyncPending(true);
//       const queue = await offlineStorage.getSyncQueue();
      
//       for (const operation of queue) {
//         try {
//           switch (operation.type) {
//             case 'CREATE':
//               await api.createBook(operation.book);
//               break;
//             case 'UPDATE':
//               await api.updateBook(operation.book.id, operation.book);
//               break;
//             case 'DELETE':
//               await api.deleteBook(operation.book.id);
//               break;
//           }
//         } catch (error) {
//           console.error(`Erreur sync ${operation.type}:`, error);
//         }
//       }
      
//       await offlineStorage.clearSyncQueue();
//       await loadFromServer();
//       Alert.alert('Synchronisation', 'Toutes les modifications ont été synchronisées !');
//     } catch (error) {
//       console.error('Erreur synchronisation:', error);
//     } finally {
//       setSyncPending(false);
//     }
//   };

//   const createBook = async (bookData: BookFormData) => {
//     const tempId = `temp_${Date.now()}`;
//     const newBook: Book = {
//       id: tempId,
//       ...bookData,
//       read: bookData.read || false,
//       favorite: bookData.favorite || false,
//     };

//     // Mettre à jour l'UI immédiatement
//     setBooks(prev => [...prev, newBook]);
//     await offlineStorage.saveBooks([...books, newBook]);

//     if (isOnline) {
//       try {
//         const serverBook = await api.createBook(bookData);
//         // Remplacer le livre temporaire par celui du serveur
//         setBooks(prev => prev.map(b => b.id === tempId ? serverBook : b));
//         await offlineStorage.saveBooks(books.map(b => b.id === tempId ? serverBook : b));
//       } catch (error) {
//         await offlineStorage.addToSyncQueue({
//           type: 'CREATE',
//           book: newBook,
//           timestamp: Date.now()
//         });
//       }
//     } else {
//       await offlineStorage.addToSyncQueue({
//         type: 'CREATE',
//         book: newBook,
//         timestamp: Date.now()
//       });
//     }
//   };

//   const updateBook = async (id: string, bookData: Partial<Book>) => {
//     const updatedBook = { ...books.find(b => b.id === id), ...bookData } as Book;
    
//     // Mettre à jour l'UI immédiatement
//     setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
//     await offlineStorage.saveBooks(books.map(b => b.id === id ? updatedBook : b));

//     if (isOnline) {
//       try {
//         await api.updateBook(id, bookData);
//       } catch (error) {
//         await offlineStorage.addToSyncQueue({
//           type: 'UPDATE',
//           book: updatedBook,
//           timestamp: Date.now()
//         });
//       }
//     } else {
//       await offlineStorage.addToSyncQueue({
//         type: 'UPDATE',
//         book: updatedBook,
//         timestamp: Date.now()
//       });
//     }
//   };

//   const deleteBook = async (id: string) => {
//     const bookToDelete = books.find(b => b.id === id);
//     if (!bookToDelete) return;

//     // Mettre à jour l'UI immédiatement
//     setBooks(prev => prev.filter(b => b.id !== id));
//     await offlineStorage.saveBooks(books.filter(b => b.id !== id));

//     if (isOnline) {
//       try {
//         await api.deleteBook(id);
//       } catch (error) {
//         await offlineStorage.addToSyncQueue({
//           type: 'DELETE',
//           book: bookToDelete,
//           timestamp: Date.now()
//         });
//       }
//     } else {
//       await offlineStorage.addToSyncQueue({
//         type: 'DELETE',
//         book: bookToDelete,
//         timestamp: Date.now()
//       });
//     }
//   };

//   const refreshBooks = async () => {
//     if (isOnline) {
//       await loadFromServer();
//     } else {
//       await loadFromStorage();
//     }
//   };

//   return (
//     <BooksContext.Provider value={{
//       books,
//       loading,
//       refreshBooks,
//       createBook,
//       updateBook,
//       deleteBook,
//       isOnline,
//       syncPending
//     }}>
//       {children}
//     </BooksContext.Provider>
//   );
// }

// export function useBooks() {
//   const context = useContext(BooksContext);
//   if (!context) {
//     throw new Error('useBooks must be used within a BooksProvider');
//   }
//   return context;
// }


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, BookFormData } from '@/types/book';
import { api } from '@/services/api';
import { offlineStorage } from '@/services/offlineStorage';
import { Alert } from 'react-native';

interface BooksContextType {
  books: Book[];
  loading: boolean;
  refreshBooks: () => Promise<void>;
  createBook: (book: BookFormData) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  isOnline: boolean;
  syncPending: boolean;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [syncPending, setSyncPending] = useState(false);

  // Vérifier la connexion et charger les données
  useEffect(() => {
    checkConnectionAndLoad();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnectionAndLoad = async () => {
    const online = await offlineStorage.isOnline();
    setIsOnline(online);
    
    if (online) {
      await loadFromServer();
      await syncOfflineChanges();
    } else {
      await loadFromStorage();
      Alert.alert('Mode Hors Ligne', 'Vous êtes en mode hors ligne. Les modifications seront synchronisées lorsque la connexion sera rétablie.');
    }
  };

  const checkConnection = async () => {
    const online = await offlineStorage.isOnline();
    setIsOnline(online);
    if (online && !isOnline) {
      await syncOfflineChanges();
    }
  };

  const loadFromServer = async () => {
    try {
      setLoading(true);
      const serverBooks = await api.getBooks();
      setBooks(serverBooks);
      await offlineStorage.saveBooks(serverBooks);
    } catch (error) {
      console.error('Erreur chargement serveur:', error);
      await loadFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromStorage = async () => {
    try {
      const localBooks = await offlineStorage.loadBooks();
      setBooks(localBooks);
    } catch (error) {
      console.error('Erreur chargement local:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncOfflineChanges = async () => {
    try {
      setSyncPending(true);
      const queue = await offlineStorage.getSyncQueue();
      
      for (const operation of queue) {
        try {
          switch (operation.type) {
            case 'CREATE':
              await api.createBook(operation.book);
              break;
            case 'UPDATE':
              await api.updateBook(operation.book.id, operation.book);
              break;
            case 'DELETE':
              await api.deleteBook(operation.book.id);
              break;
          }
        } catch (error) {
          console.error(`Erreur sync ${operation.type}:`, error);
        }
      }
      
      await offlineStorage.clearSyncQueue();
      await loadFromServer();
      Alert.alert('Synchronisation', 'Toutes les modifications ont été synchronisées !');
    } catch (error) {
      console.error('Erreur synchronisation:', error);
    } finally {
      setSyncPending(false);
    }
  };

  // ✅ MÊME NOM que dans le context simple
  const createBook = async (bookData: BookFormData) => {
    const tempId = `temp_${Date.now()}`;
    const newBook: Book = {
      id: tempId,
      ...bookData,
      read: bookData.read || false,
      favorite: bookData.favorite || false,
    };

    setBooks(prev => [...prev, newBook]);
    await offlineStorage.saveBooks([...books, newBook]);

    if (isOnline) {
      try {
        const serverBook = await api.createBook(bookData);
        setBooks(prev => prev.map(b => b.id === tempId ? serverBook : b));
        await offlineStorage.saveBooks(books.map(b => b.id === tempId ? serverBook : b));
      } catch (error) {
        await offlineStorage.addToSyncQueue({
          type: 'CREATE',
          book: newBook,
          timestamp: Date.now()
        });
      }
    } else {
      await offlineStorage.addToSyncQueue({
        type: 'CREATE',
        book: newBook,
        timestamp: Date.now()
      });
    }
  };

  // ✅ MÊME NOM que dans le context simple
  const updateBook = async (id: string, bookData: Partial<Book>) => {
    const updatedBook = { ...books.find(b => b.id === id), ...bookData } as Book;
    
    setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
    await offlineStorage.saveBooks(books.map(b => b.id === id ? updatedBook : b));

    if (isOnline) {
      try {
        await api.updateBook(id, bookData);
      } catch (error) {
        await offlineStorage.addToSyncQueue({
          type: 'UPDATE',
          book: updatedBook,
          timestamp: Date.now()
        });
      }
    } else {
      await offlineStorage.addToSyncQueue({
        type: 'UPDATE',
        book: updatedBook,
        timestamp: Date.now()
      });
    }
  };

  // ✅ MÊME NOM que dans le context simple
  const deleteBook = async (id: string) => {
    const bookToDelete = books.find(b => b.id === id);
    if (!bookToDelete) return;

    setBooks(prev => prev.filter(b => b.id !== id));
    await offlineStorage.saveBooks(books.filter(b => b.id !== id));

    if (isOnline) {
      try {
        await api.deleteBook(id);
      } catch (error) {
        await offlineStorage.addToSyncQueue({
          type: 'DELETE',
          book: bookToDelete,
          timestamp: Date.now()
        });
      }
    } else {
      await offlineStorage.addToSyncQueue({
        type: 'DELETE',
        book: bookToDelete,
        timestamp: Date.now()
      });
    }
  };

  // ✅ MÊME NOM que dans le context simple
  const refreshBooks = async () => {
    if (isOnline) {
      await loadFromServer();
    } else {
      await loadFromStorage();
    }
  };

  return (
    <BooksContext.Provider value={{
      // ✅ TOUTES les propriétés du simple
      books,
      loading,
      refreshBooks,
      
      // ✅ PLUS les méthodes avancées
      createBook,
      updateBook,
      deleteBook,
      isOnline,
      syncPending
    }}>
      {children}
    </BooksContext.Provider>
  );
}

// ✅ MÊME NOM que dans le context simple
export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}