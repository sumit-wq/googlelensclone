import { combineReducers, configureStore } from '@reduxjs/toolkit';
import permissionReducer from './permissionSlice';
import {statusBarReducer} from './statusbarSlice';

const rootReducer = combineReducers({
    permissions: permissionReducer,
    statusBarReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: true,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;