import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store/store';
import { setSelectedSources, toggleSource, clearSources } from '@/data/store/sources-slice';

export function useSelectedSources() {
  const dispatch = useDispatch();
  const selectedSourceIds = useSelector((state: RootState) => state.sources.selectedSourceIds);
  const isInitialized = useSelector((state: RootState) => state.sources.isInitialized);

  const setSources = (sourceIds: string[]) => {
    dispatch(setSelectedSources(sourceIds));
  };

  const toggle = (sourceId: string) => {
    dispatch(toggleSource(sourceId));
  };

  const clear = () => {
    dispatch(clearSources());
  };

  const hasSources = selectedSourceIds.length > 0;

  return {
    selectedSourceIds,
    isInitialized,
    setSources,
    toggle,
    clear,
    hasSources,
  };
}

