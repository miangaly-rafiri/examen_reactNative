import { useState } from 'react';
import { Alert, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from './themed-text';

interface ImagePickerProps {
  currentImage?: string;
  onImageSelected: (imageUri: string) => void;
}

export function BookImagePicker({ currentImage, onImageSelected }: ImagePickerProps) {
  const [image, setImage] = useState(currentImage);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
      console.error('Erreur ImagePicker:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <ThemedText style={styles.placeholderEmoji}>📷</ThemedText>
            <ThemedText style={styles.placeholderText}>Ajouter une couverture</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imageButton: {
    width: 120,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  placeholderEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});