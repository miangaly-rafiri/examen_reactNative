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