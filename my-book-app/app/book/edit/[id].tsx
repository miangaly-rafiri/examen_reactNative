import { TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Switch, View, Image} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../services/api';
import { BookFormData } from '../../../types/book';
import { useState, useEffect } from 'react';
import { useBooks } from '../../../contexts/BooksContext';
import { RainbowBackground } from '@/components/rainbow-background';
import { StarRating } from '@/components/star-rating';
import { BookImagePicker } from '@/components/image';
// import { imageCacheService } from '../../../services/imageCache';


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
        rating: undefined, 
        cover: undefined
    });

    useEffect(() => {
        if (typeof id === 'string') {
            loadBook(id);
        }
    }, [id]);

    const loadBook = async (bookId: string) => {
        try {
            // const localImage = await imageCacheService.getLocalImage(bookId);
            const book = await api.getBook(bookId);
            setFormData({
                name: book.name,
                author: book.author,
                editor: book.editor || '',
                theme: book.theme || '',
                read: book.read || false,
                favorite: book.favorite || false,
                year: book.year || 0,
                rating: book.rating, 
                //  cover: localImage || book.cover || undefined
                cover: book.cover || undefined

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

           {/* AFFICHAGE DE L'IMAGE EXISTANTE */}
                <View style={styles.coverContainer}>
                    <Text style={styles.sectionLabel}>Image actuelle :</Text>
                    {formData.cover ? (
                        <Image 
                            source={{ uri: formData.cover }} 
                            style={styles.existingImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>📚</Text>
                            <Text style={styles.placeholderSubtext}>Aucune image</Text>
                        </View>
                    )}
                </View>

              <BookImagePicker
                currentImage={formData.cover}
                onImageSelected={(imageUri) => setFormData(prev => ({ ...prev, cover: imageUri }))}
            />

                {/* AFFICHAGE DE L'URL POUR DEBUG */}
                {formData.cover && (
                    <View style={styles.urlContainer}>
                        <Text style={styles.urlLabel}>URL de l'image :</Text>
                        <Text style={styles.urlText} numberOfLines={2}>
                            {formData.cover}
                        </Text>
                        <Text style={styles.urlType}>
                            Type: {formData.cover.startsWith('http') ? 'URL distante' : 'URI locale'}
                        </Text>
                    </View>
                )}

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
            <StarRating
  rating={formData.rating || 0}
  onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
  editable={true}
  size={32}
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
       label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: 'white',
    },
    // url de l'image
        urlContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    urlLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    urlText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'monospace',
    },
    urlType: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 4,
        fontStyle: 'italic',
    },
    noImageText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginBottom: 16,
    },

    // images 
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 10,
    },
    coverContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    existingImage: {
        width: 150,
        height: 200,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    pickerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    previewContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    previewImage: {
        width: 120,
        height: 160,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    placeholder: {
        width: 150,
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'dashed',
    },
    placeholderText: {
        fontSize: 32,
        marginBottom: 8,
    },
    placeholderSubtext: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
    },

});