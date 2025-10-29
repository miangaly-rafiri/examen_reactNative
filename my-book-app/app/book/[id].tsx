import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../services/api';
import { Book } from '../../types/book';
import { useState, useEffect } from 'react';
import { useBooks } from '../../contexts/BooksContext';
import { RainbowBackground } from '../../components/rainbow-background';

export default function BookDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        loadBook();
    }, [id]);

    const loadBook = async () => {
        if (typeof id === 'string') {
            try {
                const data = await api.getBook(id);
                setBook(data);
            } catch (error) {
                console.error('Erreur lors du chargement du livre:', error);
            }
        }
    };

    const { refreshBooks } = useBooks();

    const handleToggleRead = async () => {
        if (book) {
            try {
                const updated = await api.toggleReadStatus(book.id, !book.read);
                setBook(updated);
                await refreshBooks();
            } catch (error) {
                console.error('Erreur lors de la modification du statut:', error);
            }
        }
    };

    const handleDelete = async () => {
        if (book) {
            try {
                await api.deleteBook(book.id);
                await refreshBooks();
                router.back();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    if (!book) {
        return (
            <RainbowBackground>
                <View style={styles.container}>
                    <Text style={styles.title}>Chargement...</Text>
                </View>
            </RainbowBackground>
        );
    }

    return (
        <RainbowBackground>
            <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{book.name}</Text>
                    <Text style={styles.headerSubtitle}>par {book.author}</Text>
                </View>

                {book.year && (
                    <Text style={styles.info}>Année : {book.year}</Text>
                )}

                {book.theme && (
                    <Text style={styles.info}>Thème : {book.theme}</Text>
                )}

                {book.rating && (
                    <Text style={styles.info}>Note : {book.rating}/5</Text>
                )}

                <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.button, styles.readButton]} 
                    onPress={handleToggleRead}
                >
                    <Text style={styles.buttonText}>
                        {book.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.editButton]}
                    onPress={() => router.push(`/book/edit/${book.id}`)}
                >
                    <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </RainbowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    author: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 16,
    },
    info: {
        fontSize: 16,
        marginBottom: 8,
        color: 'white',
    },
    header: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        padding: 20,
        paddingTop: 28,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },
    actions: {
        marginTop: 24,
        gap: 12,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    readButton: {
        backgroundColor: '#4CAF50',
    },
    editButton: {
        backgroundColor: '#2196F3',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});