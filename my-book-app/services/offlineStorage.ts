import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/book';

const OFFLINE_BOOKS_KEY = 'offline_books';
const SYNC_QUEUE_KEY = 'sync_queue';

interface SyncOperation {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  book: Book;
  timestamp: number;
}

export const offlineStorage = {
  // Sauvegarder les livres localement
  async saveBooks(books: Book[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_BOOKS_KEY, JSON.stringify(books));
      console.log('💾 Livres sauvegardés localement');
    } catch (error) {
      console.error('❌ Erreur sauvegarde locale:', error);
    }
  },

  // Charger les livres depuis le stockage local
  async loadBooks(): Promise<Book[]> {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_BOOKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Erreur chargement local:', error);
      return [];
    }
  },

  // Ajouter une opération à la file de synchronisation
  async addToSyncQueue(operation: SyncOperation): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      queue.push(operation);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('❌ Erreur ajout file sync:', error);
    }
  },

  // Récupérer la file de synchronisation
  async getSyncQueue(): Promise<SyncOperation[]> {
    try {
      const stored = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  },

  // Vider la file de synchronisation
  async clearSyncQueue(): Promise<void> {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
  },

  // Vérifier la connexion internet avec gestion de timeout
  async isOnline(): Promise<boolean> {
    try {
      // Utiliser Promise.race pour gérer le timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });

      const fetchPromise = fetch('http://localhost:3000/books', {
        method: 'HEAD'
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      return response.ok;
    } catch (error) {
      console.log('🔌 Hors ligne ou serveur inaccessible');
      return false;
    }
  }
};