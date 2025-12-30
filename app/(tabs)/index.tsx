import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useGetSourcesQuery } from '@/data/api/news-api';

export default function HomeScreen() {

  const { data } = useGetSourcesQuery();

  console.log(data);

  return (
  <ThemedView style={styles.container}>  
    
  </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
