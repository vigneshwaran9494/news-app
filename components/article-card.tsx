import { StyleSheet, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { TopHeadlineArticle, EverythingArticle } from '@/data/types/top-headlines';

type Article = TopHeadlineArticle | EverythingArticle;

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (article.url) {
      Linking.openURL(article.url).catch((err) => {
        console.error('Failed to open URL:', err);
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

      return date.toLocaleDateString(Platform.OS === 'ios' ? 'en-US' : 'default', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } catch {
      return '';
    }
  };

  const hasValidImage = article.urlToImage && article.urlToImage.trim().length > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.cardContent}>
        {hasValidImage ? (
          <Image
            source={{ uri: article.urlToImage }}
            style={styles.image}
            resizeMode="cover"
            onError={() => {
              // Image failed to load, but we'll keep the placeholder fallback in the component
            }}
          />
        ) : (
          <ThemedView style={[styles.image, styles.imagePlaceholder]}>
            <ThemedText style={styles.placeholderText}>No Image</ThemedText>
          </ThemedView>
        )}
        <ThemedView style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
            {article.title}
          </ThemedText>
          {article.description && (
            <ThemedText style={styles.description} numberOfLines={3}>
              {article.description}
            </ThemedText>
          )}
          <ThemedView style={styles.metaContainer}>
            <ThemedText style={styles.source}>{article.source.name}</ThemedText>
            {article.publishedAt && (
              <ThemedText style={styles.date}>{formatDate(article.publishedAt)}</ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  imagePlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  title: {
    marginBottom: 6,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  source: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    flex: 1,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 8,
  },
});

