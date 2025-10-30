import { TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Switch} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { BookFormData } from '../../../types/book';
import { useState, useEffect } from 'react';
import { useBooks } from '../../../contexts/BooksContext';
import { RainbowBackground } from '@/components/rainbow-background';


export default function EditBook() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState<BookFormData>({
        name: '',
        author: '',
        editor: '',
        theme: '',
        read: false,
        favorite: false,
        year: 0,
        rating: undefined
    });

    useEffect(() => {
        if (typeof id === 'string') {
            loadBook(id);
        }
    }, [id]);

    const loadBook = async (bookId: string) => {
        try {
            const book = await api.getBook(bookId);
            setFormData({
                name: book.name,
                author: book.author,
                editor: book.editor || '',
                theme: book.theme || '',
                read: book.read || false,
                favorite: book.favorite || false,
                year: book.year || 0,
                rating: book.rating
            });
        } catch (error) {
            console.error('Erreur lors du chargement du livre:', error);
        }
    };

    const { refreshBooks } = useBooks();

    const handleSubmit = async () => {
        if (typeof id === 'string') {
            try {
                await api.updateBook(id, formData);
                await refreshBooks();
                router.back();
            } catch (error) {
                console.error('Erreur lors de la mise à jour du livre:', error);
            }
        }
    };

    return (
        <RainbowBackground>
        <ScrollView style={styles.container}>
            <Text>
                Modifer le livre
            </Text>
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
<Text style={styles.label}>Lu</Text>
<Switch
  value={formData.read}
  onValueChange={(value) => setFormData(prev => ({ ...prev, read: value }))}
/>

<Text style={styles.label}>Favori</Text>
<Switch
  value={formData.favorite}
  onValueChange={(value) => setFormData(prev => ({ ...prev, favorite: value }))}
/>
            <Text style={styles.label}>Année *</Text>
            <TextInput
                style={styles.input}
                value={formData.year.toString()}
                onChangeText={(text) => {
                    const year = text ? parseInt(text, 10) : 0;
                    setFormData(prev => ({ ...prev, year: isNaN(year) ? 0 : year }));
                }}
                placeholder="Année de publication"
                keyboardType="numeric"
            />

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
                <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
        </ScrollView>
         </RainbowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
        backgroundColor: '#2196F3',
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