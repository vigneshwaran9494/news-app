import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useGetTopHeadlinesQuery } from '@/data/api/news-api';
import { useSelectedSources } from '@/hooks/use-selected-sources';
import { ArticleCard } from '@/components/article-card';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { selectedSourceIds, hasSources, isInitialized } = useSelectedSources();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Build sources query parameter
  const sourcesParam = selectedSourceIds.length > 0 ? selectedSourceIds.join(',') : undefined;

  const { data, isLoading, error, refetch, isFetching } = useGetTopHeadlinesQuery(
    { sources: sourcesParam },
    { skip: !isInitialized || !hasSources }
  );

  const handleNavigateToSources = () => {
    router.push('/sources');
  };

  if (!isInitialized) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  if (!hasSources) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol name="newspaper" size={64} color={colors.icon} />
        <ThemedText type="title" style={styles.emptyTitle}>No Sources Selected</ThemedText>
        <ThemedText style={styles.emptyText}>
          Please select news sources to view headlines
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleNavigateToSources}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Select Sources</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading headlines...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.icon} />
        <ThemedText type="title" style={styles.errorTitle}>Failed to load headlines</ThemedText>
        <ThemedText style={styles.errorText}>
          Please check your internet connection and try again.
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={() => refetch()}
        >
          <ThemedText style={styles.buttonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const articles = data?.articles || [];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Top Headlines</ThemedText>
        <TouchableOpacity
          onPress={handleNavigateToSources}
          style={styles.sourcesButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol name="slider.horizontal.3" size={20} color={colors.tint} />
          <ThemedText style={[styles.sourcesButtonText, { color: colors.tint }]}>
            Change Sources
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {articles.length === 0 ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>No headlines available</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item }) => <ArticleCard article={item} />}
          keyExtractor={(item, index) => item.url || `article-${index}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={colors.tint}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    flex: 1,
  },
  sourcesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sourcesButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
});
