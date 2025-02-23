import { configureStore } from '@reduxjs/toolkit';
import graphSlice from './graphSlice';
import configSlice from './graphConfigSlice';
import animationSlice from './animationSlice';
import { injectStore } from '../animation/GraphAnimator';

const store = configureStore({
    reducer: {
        graph: graphSlice,
        config: configSlice,
        animation: animationSlice
    },

    middleware(getDefaultMiddleware) 
    {
        return getDefaultMiddleware({
            serializableCheck:
            {
                ignoredPaths: ['animation.graph', 'animation.pseudocode'],
            }
        });
    },
});

injectStore(store);

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch