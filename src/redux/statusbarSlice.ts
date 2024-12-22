import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StatusBarState {
    backgroundColor: string;
    barStyle: 'light-content' | 'dark-content' | 'default';
    animated: boolean;
  }
  
  const statusBarSlice = createSlice({
    name: 'statusBar',
    initialState: {
      backgroundColor: 'transparent',
      barStyle: 'dark-content' as const,
      animated: true,
    },
    reducers: {
      setStatusBarStyle: (state, action: PayloadAction<Partial<StatusBarState>>) => {
        state.backgroundColor = action.payload.backgroundColor || state.backgroundColor;
        state.barStyle = action.payload.barStyle || state.barStyle;
        state.animated = action.payload.animated || state.animated;
      },
      resetStatusBar: (state, action: PayloadAction<{ isDark: boolean }>) => {
        state.backgroundColor = action.payload.isDark ? '#000000' : '#FFFFFF';
        state.barStyle = action.payload.isDark ? 'light-content' : 'dark-content';
      },
    },
  });
  
  export const { setStatusBarStyle, resetStatusBar } = statusBarSlice.actions;
  export const statusBarReducer = statusBarSlice.reducer;