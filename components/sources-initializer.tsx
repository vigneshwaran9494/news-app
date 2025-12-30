import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeSources, loadSourcesFromStorage } from '@/data/store/sources-slice';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store/store';

/**
 * Component to initialize sources from AsyncStorage on app start
 * Should be rendered once at the root level
 */
export function SourcesInitializer() {
  const dispatch = useDispatch();
  const isInitialized = useSelector((state: RootState) => state.sources.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      loadSourcesFromStorage().then((sources) => {
        dispatch(initializeSources(sources));
      });
    }
  }, [isInitialized, dispatch]);

  return null;
}

