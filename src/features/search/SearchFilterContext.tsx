import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { SearchFilters, SearchState } from './types';
import { DEFAULT_FILTERS } from './constants';

type SearchAction = 
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_RESULTS'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'APPEND_RESULTS'; payload: any }
  | { type: 'RESET_PAGE' };

const initialState: SearchState = {
  filters: DEFAULT_FILTERS,
  results: null,
  isLoading: false,
  error: null,
  hasMore: true
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload, page: 1 }, // Reset page when filters change
        results: null, // Clear results when filters change
        hasMore: true
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: DEFAULT_FILTERS,
        results: null,
        hasMore: true
      };
    
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        isLoading: false,
        error: null,
        hasMore: action.payload.items.length === state.filters.pageSize
      };
    
    case 'APPEND_RESULTS':
      return {
        ...state,
        results: {
          ...action.payload,
          items: [...(state.results?.items || []), ...action.payload.items]
        },
        isLoading: false,
        hasMore: action.payload.items.length === state.filters.pageSize
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    
    case 'RESET_PAGE':
      return { ...state, filters: { ...state.filters, page: 1 } };
    
    default:
      return state;
  }
}

type SearchContextType = {
  state: SearchState;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  loadMore: () => void;
  setError: (error: string | null) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setFilters = useCallback((filters: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.isLoading) {
      dispatch({ 
        type: 'SET_FILTERS', 
        payload: { page: state.filters.page + 1 } 
      });
    }
  }, [state.hasMore, state.isLoading, state.filters.page]);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value: SearchContextType = {
    state,
    setFilters,
    resetFilters,
    loadMore,
    setError
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchFilters() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchFilters must be used within SearchFilterProvider');
  }
  return context;
}
