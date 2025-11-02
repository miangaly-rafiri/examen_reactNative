import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, View, TextInput, Image, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '../../services/api';
import type { Book } from '../../types/book';
import { useEffect, useState } from 'react';
import { useBooks } from '../../contexts/BooksContext';
import { RainbowBackground } from '../../components/rainbow-background';
import { StarRating } from '@/components/star-rating';


export default function HomeScreen() {
    const { books, loading, refreshBooks } = useBooks();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ 
        read: undefined as boolean | undefined, 
        favorite: undefined as boolean | undefined, 
    });
    const [sortBy, setSortBy] = useState<'name' | 'author' | 'year' | 'rating'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [bookImages, setBookImages] = useState<{[key: string]: string}>({});

    useEffect(() => {
        refreshBooks();
    }, []);

    const getFilteredAndSortedBooks = () => {
        let filteredBooks = [...books];
        
        // Filtre par recherche
        if (searchQuery) {
            filteredBooks = filteredBooks.filter(book => 
                book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Filtres avancés
        if (filters.read !== undefined) {
            filteredBooks = filteredBooks.filter(book => book.read === filters.read);
        }
        if (filters.favorite !== undefined) {
            filteredBooks = filteredBooks.filter(book => book.favorite === filters.favorite);
        }
        
        // Tri
        filteredBooks.sort((a, b) => {
            let aValue: any;
            let bValue: any;
        
            if (sortBy === 'rating') {
                aValue = a.rating || 0;
                bValue = b.rating || 0;
            } else if (sortBy === 'name') {
                aValue = a.name || '';
                bValue = b.name || '';
            } else if (sortBy === 'author') {
                aValue = a.author || '';
                bValue = b.author || '';
            } else if (sortBy === 'year') {
                aValue = a.year || 0;
                bValue = b.year || 0;
            } else {
                aValue = '';
                bValue = '';
            }
        
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        
        return filteredBooks;
    };

    const filteredBooks = getFilteredAndSortedBooks();

    const getSortLabel = (sort: string) => {
        switch(sort) {
            case 'name': return 'Titre';
            case 'author': return 'Auteur';
            case 'year': return 'Année';
            case 'rating': return 'Note';
            default: return 'Titre';
        }
    };

    const handleToggleReadStatus = async (bookId: string, read: boolean) => {
    try {
        await api.toggleReadStatus(bookId, read);
        await refreshBooks(); 
    } catch (error) {
        console.error('Erreur lors de la modification du statut lu:', error);
    }
};

    const handleToggleFavorite = async (bookId: string, favorite: boolean) => {
        try {
            await api.toggleFavoriteStatus(bookId, favorite);
            await refreshBooks(); 
        } catch (error) {
            console.error('Erreur lors de la modification du favori:', error);
        }
    };

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
                            <ThemedView style={styles.headerBadges}>
                                <TouchableOpacity 
                                    style={styles.favoriteButton}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleToggleFavorite(book.id, !book.favorite);
                                    }}
                                >
                                    <ThemedText style={[
                                        styles.favoriteIcon,
                                        book.favorite && styles.favoriteIconActive
                                    ]}>
                                        {book.favorite ? '❤️' : '🤍'}
                                    </ThemedText>
                                </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.badge, book.read ? styles.readBadge : styles.unreadBadge]}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleToggleReadStatus(book.id, !book.read);
                            }}
                        >
                            <ThemedText style={styles.badgeText}>
                                {book.read ? 'Lu' : 'Non lu'}
                            </ThemedText>
                        </TouchableOpacity>
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
                        {book.rating && book.rating > 0 && (
                            <View style={styles.ratingContainer}>
                                <StarRating rating={book.rating} size={16} />
                                <ThemedText style={styles.ratingText}>({book.rating}/5)</ThemedText>
                            </View>
                        )}
                    </ThemedView>

                    <ThemedView style={styles.bookCover}>
                        {book.cover ? (
                            <Image 
                                source={{ uri: book.cover }} 
                                style={styles.bookCoverImage}
                                alt="Couverture du livre"
                                key={`${book.id}-${book.cover}`} 
                            />
                        ) : (
                            <ThemedText style={styles.bookEmoji}>📚</ThemedText>
                        )}
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
                
            {/* Barre de recherche et filtres */}
            <ThemedView style={styles.searchContainer}>
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher un livre ou auteur..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity 
                        style={styles.filterButton}
                        onPress={() => setShowFilters(true)}
                    >
                        <Text style={styles.filterButtonText}>⚙️ Filtres</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Indicateurs de filtres actifs */}
                <View style={styles.activeFilters}>
                    {filters.read !== undefined && (
                        <View style={styles.activeFilterTag}>
                            <Text style={styles.activeFilterText}>
                                {filters.read ? '📖 Lus' : '📚 Non lus'}
                            </Text>
                        </View>
                    )}
                    {filters.favorite !== undefined && (
                        <View style={styles.activeFilterTag}>
                            <Text style={styles.activeFilterText}>❤️ Favoris</Text>
                        </View>
                    )}
                    <View style={styles.activeFilterTag}>
                        <Text style={styles.activeFilterText}>
                            {sortOrder === 'asc' ? '↑' : '↓'} {getSortLabel(sortBy)}
                        </Text>
                    </View>
                </View>
            </ThemedView>
            
            {/* Liste des livres */}
            <FlatList
                data={filteredBooks}
                renderItem={renderItem}
                keyExtractor={(book) => book.id}
                contentContainerStyle={styles.list}
                // extraData={searchQuery + filters.read + filters.favorite + sortBy + sortOrder}
                 key={`book-list-${searchQuery}-${filters.read}-${filters.favorite}-${sortBy}-${sortOrder}`} 
                ListEmptyComponent={() => (
                    <ThemedView style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>
                            { searchQuery || filters.read !== undefined || filters.favorite !== undefined 
                                ? 'Aucun livre trouvé' 
                                : 'Aucun livre dans votre bibliothèque'
                            }
                        </ThemedText>
                    </ThemedView>
                )}
            />
            
            {/* Bouton pour ajouter un livre */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => router.push('/book/new')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
            
            {/* Modal de filtres */}
            <Modal
                visible={showFilters}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFilters(false)}
                accessibilityViewIsModal={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtres et Tri</Text>
                        
                        {/* Filtres */}
                        <Text style={styles.sectionTitle}>Filtres</Text>
                        
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Statut de lecture:</Text>
                            <View style={styles.filterOptions}>
                                {['Tous', 'Lus', 'Non lus'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.filterOption,
                                            filters.read === (status === 'Lus' ? true : status === 'Non lus' ? false : undefined) && 
                                            styles.filterOptionActive
                                        ]}
                                        onPress={() => setFilters(prev => ({
                                            ...prev,
                                            read: status === 'Tous' ? undefined : status === 'Lus'
                                        }))}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            filters.read === (status === 'Lus' ? true : status === 'Non lus' ? false : undefined) && 
                                            styles.filterOptionActiveText
                                        ]}>
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Favoris:</Text>
                            <View style={styles.filterOptions}>
                                {['Tous', 'Favoris', 'Non favoris'].map((fav) => (
                                    <TouchableOpacity
                                        key={fav}
                                        style={[
                                            styles.filterOption,
                                            filters.favorite === (fav === 'Favoris' ? true : fav === 'Non favoris' ? false : undefined) && 
                                            styles.filterOptionActive
                                        ]}
                                        onPress={() => setFilters(prev => ({
                                            ...prev,
                                            favorite: fav === 'Tous' ? undefined : fav === 'Favoris'
                                        }))}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            filters.favorite === (fav === 'Favoris' ? true : fav === 'Non favoris' ? false : undefined) && 
                                            styles.filterOptionActiveText
                                        ]}>
                                            {fav}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Tri */}
                        <Text style={styles.sectionTitle}>Tri</Text>
                        
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Trier par:</Text>
                            <View style={styles.filterOptions}>
                                {['name', 'author', 'year', 'rating'].map((sort) => (
                                    <TouchableOpacity
                                        key={sort}
                                        style={[
                                            styles.filterOption,
                                            sortBy === sort && styles.filterOptionActive
                                        ]}
                                        onPress={() => setSortBy(sort as any)}
                                    >
                                        <Text style={[
                                            styles.filterOptionText,
                                            sortBy === sort && styles.filterOptionActiveText
                                        ]}>
                                            {getSortLabel(sort)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Ordre:</Text>
                            <View style={styles.filterOptions}>
                                <TouchableOpacity
                                    style={[
                                        styles.filterOption,
                                        sortOrder === 'asc' && styles.filterOptionActive
                                    ]}
                                    onPress={() => setSortOrder('asc')}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        sortOrder === 'asc' && styles.filterOptionActiveText
                                    ]}>
                                        Croissant (A-Z)
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.filterOption,
                                        sortOrder === 'desc' && styles.filterOptionActive
                                    ]}
                                    onPress={() => setSortOrder('desc')}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        sortOrder === 'desc' && styles.filterOptionActiveText
                                    ]}>
                                        Décroissant (Z-A)
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.applyButton}
                            onPress={() => setShowFilters(false)}
                        >
                            <Text style={styles.applyButtonText}>Appliquer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </RainbowBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF6B6B',
    },
    header: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
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
        borderColor: 'rgba(255, 255, 255, 0.2)', 
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    bookCoverImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    readBadge: {
        backgroundColor: '#96CEB4', 
    },
    unreadBadge: {
        backgroundColor: '#FF9999',
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
        backgroundColor: '#45B7D1', 
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
    headerBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    favoriteButton: {
        padding: 4,
    },
    favoriteIcon: {
        fontSize: 20,
    },
    favoriteIconActive: {
        fontSize: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
    },
    searchContainer: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 0,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 12,
    },
    searchInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    filterButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    activeFilters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    activeFilterTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    activeFilterText: {
        fontSize: 12,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 12,
        color: '#333',
    },
    filterGroup: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#666',
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterOption: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    filterOptionActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    filterOptionText: {
        fontSize: 14,
        color: '#333',
    },
    filterOptionActiveText: {
        color: 'white',
    },
    applyButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});