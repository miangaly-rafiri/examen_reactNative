import { Book, BookFormData } from '../types/book';

const API_URL = 'http://localhost:3000';
// const API_URL = 'http://10.105.1.242:3000';
// const API_URL = 'http://192.168.1.69:3000';


export const api = {
    // Récupérer 
    async getBooks(): Promise<Book[]> {
        const response = await fetch(`${API_URL}/books`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des livres');
        return response.json();
    },


  // Méthode pour uploader une image
    async uploadImage(imageUri: string): Promise<string> {
        const formData = new FormData();
        const file = {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'cover.jpg',
        } as any;
        
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'upload de l\'image');
        }

        const data = await response.json();
        return data.url;
    },


    // Récupérer par son ID
    async getBook(id: string): Promise<Book> {
        const response = await fetch(`${API_URL}/books/${id}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération du livre');
        return response.json();
    },

    // Créer un nouveau
    async createBook(book: BookFormData): Promise<Book> {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });
        if (!response.ok) throw new Error('Erreur lors de la création du livre');
        return response.json();
    },

    // // Mettre à jour 
    async updateBook(id: string, book: Partial<Book>): Promise<Book> {
            let coverUrl = book.cover;

    // SI c'est une URI locale (blob ou file) → UPLOAD OBLIGATOIRE
    if (book.cover && (book.cover.startsWith('blob:') || book.cover.startsWith('file:'))) {
        try {
            coverUrl = await this.uploadImage(book.cover);
        } catch (error) {
            coverUrl = book.cover;
        }
    } else if (book.cover && book.cover.startsWith('http')) {
    }

    const bookData = {
        ...book,
        cover: coverUrl
    };
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour du livre');
        return response.json();
    },

    // Supprimer
    async deleteBook(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression du livre');
    },

// Ajouter une note à un livre
async addBookNote(bookId: string, content: string): Promise<any> {
  const response = await fetch(`${API_URL}/books/${bookId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'ajout de la note');
  return response.json();
},

// Mettre à jour les favoris
async toggleFavoriteStatus(id: string, favorite: boolean): Promise<Book> {
  return this.updateBook(id, { favorite })
},


// Récupérer les notes d'un livre
async getBookNotes(bookId: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/books/${bookId}/notes`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des notes');
  return response.json();
},
    // Mettre à jour le statut
    async toggleReadStatus(id: string, read: boolean): Promise<Book> {
        return this.updateBook(id, { read });
    },
}