import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  editable?: boolean;
}

export function StarRating({ rating, onRatingChange, size = 24, editable = false }: StarRatingProps) {
  const [currentRating, setCurrentRating] = useState(rating);

  const handlePress = (star: number) => {
    if (!editable) return;
    const newRating = star === currentRating ? 0 : star;
    setCurrentRating(newRating);
    onRatingChange?.(newRating);
  };

  const displayRating = editable ? currentRating : rating;

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handlePress(star)}
          disabled={!editable}
          style={styles.starButton}
        >
          <ThemedText style={[styles.star, { fontSize: size }]}>
            {star <= displayRating ? '⭐' : '☆'}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
  starButton: {
    padding: 2,
  },
  star: {
    fontSize: 24,
  },
});