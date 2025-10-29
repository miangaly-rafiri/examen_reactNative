import { Book, BookFormData } from '../types/book';

const API_URL = 'http://localhost:3000';

export const api = {
    // Récupérer 
    async getBooks(): Promise<Book[]> {
        const response = await fetch(`${API_URL}/books`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des livres');
        return response.json();
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

    // Mettre à jour 
    async updateBook(id: string, book: Partial<Book>): Promise<Book> {
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

    // Mettre à jour le statut
    async toggleReadStatus(id: string, read: boolean): Promise<Book> {
        return this.updateBook(id, { read });
    },
}