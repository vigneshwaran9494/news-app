import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search news...', isLoading = false }: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5' }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.tabIconDefault}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {isLoading && (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>...</ThemedText>
          </ThemedView>
        )}
        {value.length > 0 && !isLoading && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  loadingContainer: {
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  loadingText: {
    fontSize: 16,
  },
});

