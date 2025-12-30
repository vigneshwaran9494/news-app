import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string | string[];
  isLoading?: boolean;
}

const DEFAULT_SPEED = 100;
const DEFAULT_DELAY = 2000;

export function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Search news...', 
  isLoading = false 
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);
  const [stringIndex, setStringIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  // Convert placeholder to array if it's a string and memoize it
  const placeholderArray = useMemo(
    () => Array.isArray(placeholder) ? placeholder : [placeholder],
    [placeholder]
  );
  const shouldAnimate = !value && !isFocused && !isLoading;

  // Opacity value of the Cursor
  const opacityValue = useRef(new Animated.Value(0)).current;

  // This is the cursor animation that starts right away
  useEffect(() => {
    if (!shouldAnimate) return;

    // Creating a loop so that it continually blinks
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 2,
          useNativeDriver: true,
        }),
        Animated.delay(300),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 2,
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]),
    );
    blinkAnimation.start();

    return () => {
      blinkAnimation.stop();
    };
  }, [opacityValue, shouldAnimate]);

  // This is the Text animation
  useEffect(() => {
    if (!shouldAnimate || placeholderArray.length === 0) return;

    let isMounted = true;
    const currentText = placeholderArray[stringIndex] || '';

    const timeoutId = setTimeout(() => {
      if (!isMounted) return;

      if (textIndex < currentText.length) {
        setTextIndex(textIndex + 1);
      } else if (stringIndex < placeholderArray.length - 1) {
        setTimeout(() => {
          if (isMounted) {
            setTextIndex(0);
            setStringIndex(stringIndex + 1);
          }
        }, DEFAULT_DELAY);
      } else {
        // Loop back to the first placeholder
        setTimeout(() => {
          if (isMounted) {
            setTextIndex(0);
            setStringIndex(0);
          }
        }, DEFAULT_DELAY);
      }
    }, DEFAULT_SPEED);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [textIndex, stringIndex, shouldAnimate, placeholderArray]);

  // Reset animation when focus changes or value changes
  useEffect(() => {
    if (!shouldAnimate) {
      setTextIndex(0);
      setStringIndex(0);
    }
  }, [shouldAnimate]);

  const currentPlaceholderText = placeholderArray[stringIndex] || '';
  const displayedText = shouldAnimate 
    ? currentPlaceholderText.substring(0, textIndex)
    : '';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5' }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} style={styles.icon} />
        <View style={styles.inputContainer}>
          {shouldAnimate && (
            <View style={styles.typewriterContainer}>
              <ThemedText style={[styles.typewriterText, { color: colors.tabIconDefault }]}>
                {displayedText}
              </ThemedText>
              <Animated.View style={{ opacity: opacityValue }}>
                <ThemedText style={[styles.cursor, { color: colors.tabIconDefault }]}>_</ThemedText>
              </Animated.View>
            </View>
          )}
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={shouldAnimate ? '' : (Array.isArray(placeholder) ? placeholder[0] : placeholder)}
            placeholderTextColor={colors.tabIconDefault}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
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
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  typewriterContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  typewriterText: {
    fontSize: 16,
  },
  cursor: {
    fontSize: 16,
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

