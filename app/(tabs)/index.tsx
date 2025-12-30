import ArticleCard from '@/components/article-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import HeaderBar from '@/components/ui/HeaderBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useGetTopHeadlinesQuery } from '@/data/api/news-api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSelectedSources } from '@/hooks/use-selected-sources';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { selectedSourceIds, hasSources, isInitialized } = useSelectedSources();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Build sources query parameter
  const sourcesParam = selectedSourceIds.length > 0 ? selectedSourceIds.join(',') : undefined;

  const { data, isLoading, error, refetch, isFetching } = useGetTopHeadlinesQuery(
    { sources: sourcesParam },
    { skip: !isInitialized || !hasSources }
  );

  const handleNavigateToSources = () => {
    router.push('/sources');
  };

  const headerHeight = insets.top + 56; // safe area + header content (48) + padding (8)

  if (!isInitialized) {
    return (
      <ThemedView style={styles.container}>
        <HeaderBar title="Top Headlines" />
        <ThemedView style={[styles.centerContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color={colors.tint} />
        </ThemedView>
      </ThemedView>
    );
  }

  if (!hasSources) {
    return (
      <ThemedView style={styles.container}>
        <HeaderBar title="Top Headlines" />
        <ThemedView style={[styles.centerContainer, { paddingTop: headerHeight }]}>
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
      </ThemedView>
    );
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <HeaderBar title="Top Headlines" />
        <ThemedView style={[styles.centerContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading headlines...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <HeaderBar title="Top Headlines" />
        <ThemedView style={[styles.centerContainer, { paddingTop: headerHeight }]}>
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
      </ThemedView>
    );
  }

  const articles = data?.articles || [];

  return (
    <ThemedView style={styles.container}>
      <HeaderBar 
        title="Top Headlines" 
        rightAction={{
          icon: "ellipsis-vertical",
          onPress: handleNavigateToSources,
        }}
      />
      <ThemedView style={[styles.contentContainer, { paddingTop: headerHeight }]}>
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
