import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_IMAGES_KEY = 'local_uploaded_images';

export interface LocalImagesCache {
  [bookId: string]: string; // { bookId: imageUri }
}

export const imageCacheService = {
  // Sauvegarder une image UPLOADÉE localement
  async saveLocalImage(bookId: string, imageUri: string): Promise<void> {
    try {
      // Ne sauvegarder que les images locales (blob:, file:)
      if (imageUri.startsWith('blob:') || imageUri.startsWith('file:')) {
        const existingCache = await this.getLocalCache();
        const updatedCache = {
          ...existingCache,
          [bookId]: imageUri
        };
        await AsyncStorage.setItem(LOCAL_IMAGES_KEY, JSON.stringify(updatedCache));
        console.log('💾 Image locale sauvegardée:', bookId);
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde image locale:', error);
    }
  },

  // Récupérer une image locale
  async getLocalImage(bookId: string): Promise<string | null> {
    try {
      const cache = await this.getLocalCache();
      return cache[bookId] || null;
    } catch (error) {
      console.error('❌ Erreur récupération image locale:', error);
      return null;
    }
  },

  // Récupérer tout le cache local
  async getLocalCache(): Promise<LocalImagesCache> {
    try {
      const cache = await AsyncStorage.getItem(LOCAL_IMAGES_KEY);
      return cache ? JSON.parse(cache) : {};
    } catch (error) {
      console.error('❌ Erreur lecture cache local:', error);
      return {};
    }
  },

  // Supprimer une image locale (quand elle est uploadée vers S3)
  async removeLocalImage(bookId: string): Promise<void> {
    try {
      const cache = await this.getLocalCache();
      delete cache[bookId];
      await AsyncStorage.setItem(LOCAL_IMAGES_KEY, JSON.stringify(cache));
      console.log('🗑️ Image locale supprimée:', bookId);
    } catch (error) {
      console.error('❌ Erreur suppression image locale:', error);
    }
  }
};