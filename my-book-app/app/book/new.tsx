import { TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import type { BookFormData } from '../../types/book';
import { useState } from 'react';
import { useBooks } from '../../contexts/BooksContext';

export default function NewBook() {
    const router = useRouter();
    const [formData, setFormData] = useState<BookFormData>({
        name: '',
        author: '',
        editor: '',
        theme: '',
        year: 0, 
        rating: undefined
    });
    const [error, setError] = useState<string | null>(null);

    const { refreshBooks } = useBooks();

    const handleSubmit = async () => {
        try {
            setError(null);
            if (!formData.name || !formData.author || !formData.editor || !formData.year) {
                setError("Tous les champs marqués d'un * sont requis");
                return;
            }
            await api.createBook(formData);
            await refreshBooks();
             Alert.alert('Succès', 'Livre créé avec succès !');
            router.back();
        } catch (error: any) {
            setError(error.message || "Une erreur est survenue lors de la création du livre");
            console.error('Erreur lors de la création du livre:', error);
    Alert.alert('Erreur', 'Impossible de créer le livre');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Titre</Text>
            <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Titre du livre"
            />

            <Text style={styles.label}>Auteur *</Text>
            <TextInput
                style={styles.input}
                value={formData.author}
                onChangeText={(text) => setFormData(prev => ({ ...prev, author: text }))}
                placeholder="Nom de l'auteur"
            />

            <Text style={styles.label}>Éditeur *</Text>
            <TextInput
                style={styles.input}
                value={formData.editor}
                onChangeText={(text) => setFormData(prev => ({ ...prev, editor: text }))}
                placeholder="Nom de l'éditeur"
            />

            <Text style={styles.label}>Thème</Text>
            <TextInput
                style={styles.input}
                value={formData.theme}
                onChangeText={(text) => setFormData(prev => ({ ...prev, theme: text }))}
                placeholder="Thème du livre"
            />

            <Text style={styles.label}>Année *</Text>
            <TextInput
                style={styles.input}
                value={formData.year ? formData.year.toString() : ''}
                onChangeText={(text) => {
                    const year = text ? parseInt(text, 10) : 0;
                    setFormData(prev => ({ ...prev, year: isNaN(year) ? 0 : year }));
                }}
                placeholder="Année de publication"
                keyboardType="numeric"
            />
            
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            <Text style={styles.label}>Note</Text>
            <TextInput
                style={styles.input}
                value={formData.rating?.toString() || ''}
                onChangeText={(text) => {
                    const rating = text ? parseInt(text, 10) : undefined;
                    setFormData(prev => ({ ...prev, rating: rating && rating <= 5 ? rating : undefined }));
                }}
                placeholder="Note sur 5"
                keyboardType="numeric"
            />

            <TouchableOpacity 
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Créer</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});