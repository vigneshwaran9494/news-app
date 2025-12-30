import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SourcesState {
  selectedSourceIds: string[];
  isInitialized: boolean;
}

const initialState: SourcesState = {
  selectedSourceIds: [],
  isInitialized: false,
};

const STORAGE_KEY = '@news_app_selected_sources';

// Load sources from AsyncStorage
export const loadSourcesFromStorage = async (): Promise<string[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading sources from storage:', error);
    return [];
  }
};

// Save sources to AsyncStorage
export const saveSourcesToStorage = async (sourceIds: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sourceIds));
  } catch (error) {
    console.error('Error saving sources to storage:', error);
  }
};

const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    setSelectedSources: (state, action: PayloadAction<string[]>) => {
      state.selectedSourceIds = action.payload;
      saveSourcesToStorage(action.payload);
    },
    toggleSource: (state, action: PayloadAction<string>) => {
      const sourceId = action.payload;
      const index = state.selectedSourceIds.indexOf(sourceId);
      if (index > -1) {
        state.selectedSourceIds.splice(index, 1);
      } else {
        state.selectedSourceIds.push(sourceId);
      }
      saveSourcesToStorage(state.selectedSourceIds);
    },
    clearSources: (state) => {
      state.selectedSourceIds = [];
      saveSourcesToStorage([]);
    },
    initializeSources: (state, action: PayloadAction<string[]>) => {
      state.selectedSourceIds = action.payload;
      state.isInitialized = true;
    },
  },
});

export const { setSelectedSources, toggleSource, clearSources, initializeSources } = sourcesSlice.actions;
export default sourcesSlice.reducer;

