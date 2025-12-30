import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useGetTopHeadlinesQuery } from '@/data/api/news-api';

export default function HomeScreen() {

  const { data } = useGetTopHeadlinesQuery({ country: 'us' });

  console.log(data);

  return (
  <ThemedView>  
    
  </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
