import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useGetSourcesQuery } from '@/data/api/news-api';
import { useSelectedSources } from '@/hooks/use-selected-sources';
import { useRouter } from 'expo-router';
import { Source } from '@/data/types/sources.type';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function SourcesScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetSourcesQuery();
  const { selectedSourceIds, toggle, hasSources } = useSelectedSources();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleToggleSource = (sourceId: string) => {
    toggle(sourceId);
  };

  const handleSave = () => {
    if (hasSources) {
      router.back();
    }
  };

  const renderSourceItem = ({ item }: { item: Source }) => {
    const isSelected = selectedSourceIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.sourceItem,
          isSelected && { backgroundColor: colorScheme === 'dark' ? '#2a4a6a' : '#e3f2fd' },
        ]}
        onPress={() => handleToggleSource(item.id)}
        activeOpacity={0.7}
      >
        <ThemedView style={styles.sourceContent}>
          <ThemedView style={styles.sourceInfo}>
            <ThemedText type="defaultSemiBold" style={styles.sourceName}>
              {item.name}
            </ThemedText>
            {item.description && (
              <ThemedText style={styles.sourceDescription} numberOfLines={2}>
                {item.description}
              </ThemedText>
            )}
            <ThemedView style={styles.sourceMeta}>
              <ThemedText style={styles.sourceCategory}>{item.category}</ThemedText>
              <ThemedText style={styles.sourceLanguage}>{item.language.toUpperCase()}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.checkboxContainer}>
            {isSelected ? (
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.tint} />
            ) : (
              <IconSymbol name="circle" size={24} color={colors.tabIconDefault} />
            )}
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading sources...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.icon} />
        <ThemedText type="title" style={styles.errorTitle}>Failed to load sources</ThemedText>
        <ThemedText style={styles.errorText}>
          Please check your internet connection and try again.
        </ThemedText>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
          onPress={() => refetch()}
        >
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Select News Sources</ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose your preferred news sources to personalize your feed
        </ThemedText>
        {hasSources && (
          <ThemedText style={styles.selectedCount}>
            {selectedSourceIds.length} source{selectedSourceIds.length !== 1 ? 's' : ''} selected
          </ThemedText>
        )}
      </ThemedView>

      <FlatList
        data={data?.sources || []}
        renderItem={renderSourceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.tint}
          />
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No sources available</ThemedText>
          </ThemedView>
        }
      />

      {hasSources && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.saveButtonText}>Save & Continue</ThemedText>
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  listContent: {
    paddingBottom: 100,
  },
  sourceItem: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sourceInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sourceName: {
    marginBottom: 4,
    fontSize: 16,
  },
  sourceDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  sourceMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  sourceCategory: {
    fontSize: 12,
    textTransform: 'capitalize',
    opacity: 0.6,
  },
  sourceLanguage: {
    fontSize: 12,
    opacity: 0.6,
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: 'center',
    borderRadius: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});

