import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RainbowBackground } from '@/components/rainbow-background';
import { statsService, Stats } from '@/services/statsService';
import { useBooks } from '../contexts/BooksContext';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const { books, isOnline } = useBooks();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [books]);

  const loadStats = async () => {
    try {
      setLoading(true);
      let statsData: Stats;
      
      if (isOnline) {
        try {
          statsData = await statsService.getServerStats();
        } catch {
          // Fallback sur le calcul local
          statsData = statsService.calculateStats(books);
        }
      } else {
        statsData = statsService.calculateStats(books);
      }
      
      setStats(statsData);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      // En cas d'erreur, calculer les stats locales
      const localStats = statsService.calculateStats(books);
      setStats(localStats);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RainbowBackground>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Chargement des statistiques...</ThemedText>
        </View>
      </RainbowBackground>
    );
  }

  if (!stats) {
    return (
      <RainbowBackground>
        <View style={styles.centered}>
          <ThemedText>Erreur lors du chargement des statistiques</ThemedText>
        </View>
      </RainbowBackground>
    );
  }

  // Variables sécurisées
  const safeBooksByTheme = stats.booksByTheme || [];
  const hasThemeData = safeBooksByTheme.length > 0;

  // Données pour le graphique circulaire (statut de lecture)
  const readingData = [
    {
      name: 'Lus',
      population: stats.readCount,
      color: '#4CAF50',
      legendFontColor: '#FFF',
      legendFontSize: 14,
    },
    {
      name: 'Non lus',
      population: stats.unreadCount,
      color: '#FF9800',
      legendFontColor: '#FFF',
      legendFontSize: 14,
    },
  ];

  // Données pour le graphique en barres (thèmes) - seulement si on a des données
  const themeData = hasThemeData ? {
    labels: safeBooksByTheme.slice(0, 5).map(item => item.theme.substring(0, 10)),
    datasets: [
      {
        data: safeBooksByTheme.slice(0, 5).map(item => item.count),
      },
    ],
  } : {
    labels: [],
    datasets: [{ data: [] }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <RainbowBackground>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>📊 Statistiques</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {isOnline ? '✅ En ligne' : '🟡 Mode hors ligne'}
          </ThemedText>
        </ThemedView>

        {/* Cartes de statistiques */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalBooks}</Text>
            <Text style={styles.statLabel}>Total livres</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.readCount}</Text>
            <Text style={styles.statLabel}>Lus</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.favoritesCount}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Moyenne notes</Text>
          </View>
        </View>

        {/* Graphique circulaire - Statut de lecture */}
        <ThemedView style={styles.chartSection}>
          <ThemedText style={styles.chartTitle}>Statut de lecture</ThemedText>
          <PieChart
            data={readingData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </ThemedView>

        {/* Graphique en barres - Thèmes populaires */}
        {hasThemeData && (
          <ThemedView style={styles.chartSection}>
            <ThemedText style={styles.chartTitle}>Thèmes populaires</ThemedText>
            <BarChart
              data={themeData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero={true}
            />
          </ThemedView>
        )}

        {/* Détails supplémentaires */}
        {hasThemeData ? (
          <ThemedView style={styles.detailsSection}>
            <ThemedText style={styles.detailsTitle}>Détails par thème</ThemedText>
            {safeBooksByTheme.map((item, index) => (
              <View key={index} style={styles.themeItem}>
                <ThemedText style={styles.themeName}>{item.theme}</ThemedText>
                <ThemedText style={styles.themeCount}>{item.count} livre(s)</ThemedText>
              </View>
            ))}
          </ThemedView>
        ) : (
          <ThemedView style={styles.detailsSection}>
            <ThemedText style={styles.detailsTitle}>Détails par thème</ThemedText>
            <ThemedText style={styles.noDataText}>Aucun thème disponible</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </RainbowBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  chartSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  themeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  themeName: {
    flex: 1,
    fontSize: 14,
  },
  themeCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
});