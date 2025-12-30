import ArticleCard from '@/components/article-card';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import HeaderBar from '@/components/ui/HeaderBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useGetEverythingQuery } from '@/data/api/news-api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDebounce } from '@/hooks/use-debounce';
import { useSelectedSources } from '@/hooks/use-selected-sources';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const { isInitialized } = useSelectedSources();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Only search if query is not empty
  const shouldSearch = debouncedSearchQuery.trim().length > 0;

  const { data, isLoading, error, isFetching } = useGetEverythingQuery(
    {
      q: debouncedSearchQuery.trim(),
      sortBy: 'publishedAt',
      language: 'en',
      pageSize: 20,
    },
    {
      skip: !shouldSearch || !isInitialized,
    }
  );

  const articles = data?.articles || [];
  const hasResults = articles.length > 0;
  const showEmptyState = shouldSearch && !isLoading && !error && !hasResults;

  const headerHeight = insets.top + 56; // safe area + header content (48) + padding (8)

  return (
    <ThemedView style={styles.container}>
      <HeaderBar title="Search News" />
      <ThemedView style={[styles.contentContainer, { paddingTop: headerHeight }]}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for news articles..."
          isLoading={isFetching && shouldSearch}
        />

        {!shouldSearch && (
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="magnifyingglass" size={64} color={colors.icon} />
            <ThemedText type="subtitle" style={styles.emptyTitle}>Start Searching</ThemedText>
            <ThemedText style={styles.emptyText}>
              Enter a search query above to find news articles
            </ThemedText>
          </ThemedView>
        )}

        {isLoading && shouldSearch && (
          <ThemedView style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <ThemedText style={styles.loadingText}>Searching...</ThemedText>
          </ThemedView>
        )}

        {error && shouldSearch && (
          <ThemedView style={styles.centerContainer}>
            <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.icon} />
            <ThemedText type="title" style={styles.errorTitle}>Search Failed</ThemedText>
            <ThemedText style={styles.errorText}>
              {error && 'data' in error
                ? (error.data as { message?: string })?.message || 'An error occurred'
                : 'Please check your internet connection and try again.'}
            </ThemedText>
          </ThemedView>
        )}

        {showEmptyState && (
          <ThemedView style={styles.centerContainer}>
            <IconSymbol name="doc.text.magnifyingglass" size={64} color={colors.icon} />
            <ThemedText type="subtitle" style={styles.emptyTitle}>No Results Found</ThemedText>
            <ThemedText style={styles.emptyText}>
              Try adjusting your search query or filters
            </ThemedText>
          </ThemedView>
        )}

        {hasResults && shouldSearch && (
          <>
            <ThemedView style={styles.resultsHeader}>
              <ThemedText style={styles.resultsCount}>
                {data?.totalResults || articles.length} result{articles.length !== 1 ? 's' : ''} found
              </ThemedText>
            </ThemedView>
            <FlatList
              data={articles}
              renderItem={({ item }) => <ArticleCard article={item} />}
              keyExtractor={(item, index) => item.url || `search-article-${index}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
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
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  resultsCount: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
});
