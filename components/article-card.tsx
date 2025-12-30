import { EverythingArticle } from '@/data/types/everything-news.type';
import { TopHeadlineArticle } from '@/data/types/top-headlines.type';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Linking, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type Article = TopHeadlineArticle | EverythingArticle;

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

 function ArticleCardComponent({ article, onPress }: ArticleCardProps) {
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
      <ThemedView 
        style={styles.cardContent}
        lightColor="#ffffff"
        darkColor="#1f1f1f"
      >
        {hasValidImage ? (
          <Image
            source={{ uri: article.urlToImage }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <ThemedView style={[styles.image, styles.imagePlaceholder]}>
            <ThemedText style={styles.placeholderText}>No Image</ThemedText>
          </ThemedView>
        )}
        <ThemedView lightColor="#ffffff" darkColor="#1f1f1f" style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
            {article.title}
          </ThemedText>
          {article.description && (
            <ThemedText style={styles.description} numberOfLines={3}>
              {article.description}
            </ThemedText>
          )}
          <ThemedView lightColor="#ffffff" darkColor="#1f1f1f" style={styles.metaContainer}>
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

const ArticleCard = memo(ArticleCardComponent, (prevProps, nextProps) => {
  return prevProps.article.url === nextProps.article.url;
});

export default ArticleCard

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardContent: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    minHeight: 120,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  imagePlaceholder: {
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 4,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.75,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 6,
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

