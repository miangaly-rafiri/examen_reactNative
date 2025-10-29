import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '../../services/api';
import type { Book } from '../../types/book';
import { useEffect } from 'react';
import { useBooks } from '../../contexts/BooksContext';
import { RainbowBackground } from '../../components/rainbow-background';

export default function HomeScreen() {
    const { books, loading, refreshBooks } = useBooks();
    const router = useRouter();

    useEffect(() => {
        refreshBooks();
    }, []);

    const renderItem = ({ item: book }: { item: Book }) => (
        <TouchableOpacity
            style={styles.bookItem}
            onPress={() => router.push(`/book/${book.id}`)}
        >
            <ThemedView style={styles.bookContent}>
                <ThemedView style={styles.bookRow}>
                    <ThemedView style={styles.bookTextContent}>
                        <ThemedView style={styles.bookHeader}>
                            <ThemedText type="subtitle" style={styles.bookTitle}>
                                {book.name}
                            </ThemedText>
                            <ThemedView style={[styles.badge, book.read ? styles.readBadge : styles.unreadBadge]}>
                                <ThemedText style={styles.badgeText}>
                                    {book.read ? 'Lu' : 'Non lu'}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                        
                        <ThemedText style={styles.bookAuthor}>
                            par {book.author}
                        </ThemedText>
                        
                        {book.theme && (
                            <ThemedText style={styles.bookTheme}>
                                Thème : {book.theme}
                            </ThemedText>
                        )}
                    </ThemedView>

                    <ThemedView style={styles.bookCover}>
                        <ThemedText style={styles.bookEmoji}>📚</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }

    return (
        <RainbowBackground>
            <ThemedView style={styles.header}>
                <ThemedText style={styles.headerTitle}>Ma Bibliothèque</ThemedText>
                <ThemedText style={styles.headerSubtitle}>{books.length} livre{books.length > 1 ? 's' : ''}</ThemedText>
            </ThemedView>
            
            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(book) => book.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={() => (
                    <ThemedView style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>
                            Aucun livre dans votre bibliothèque
                        </ThemedText>
                    </ThemedView>
                )}
            />
            
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => router.push('/book/new')}
            >
                <ThemedText style={styles.fabText}>+</ThemedText>
            </TouchableOpacity>
        </RainbowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6B6B', // Rouge vif
        backgroundImage: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEEAD)', // Dégradé arc-en-ciel pastel
    },
    header: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fond semi-transparent
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    list: {
        padding: 16,
    },
    bookItem: {
        marginBottom: 16,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)', // Bordure légère
    },
    bookContent: {
        padding: 16,
    },
    bookHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black', 
        flex: 1,
    },
    bookAuthor: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    bookTheme: {
        fontSize: 14,
        color: '#888',
    },
    bookRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookTextContent: {
        flex: 1,
    },
    bookCover: {
        width: 80,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fond plus lumineux
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    bookEmoji: {
        fontSize: 32,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    readBadge: {
        backgroundColor: '#96CEB4', // Vert pastel
    },
    unreadBadge: {
        backgroundColor: '#FF9999', // Rouge pastel
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#45B7D1', // Bleu pastel
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fabText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
