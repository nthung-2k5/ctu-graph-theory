import { configureStore } from '@reduxjs/toolkit';
import graphSlice from './graphSlice';
import configSlice from './graphConfigSlice';

const store = configureStore({
    reducer: {
        graph: graphSlice,
        config: configSlice,
    },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch