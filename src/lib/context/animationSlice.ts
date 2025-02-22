import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import GraphAnimator from '../animation/GraphAnimator';
import PseudocodeAnimator from '../animation/PseudocodeAnimator';

interface AnimationState 
{
    graph: GraphAnimator;
    pseudocode: PseudocodeAnimator;
    animating: boolean;
    speed: number;
};

const initialState: AnimationState = {
    graph: new GraphAnimator(),
    pseudocode: new PseudocodeAnimator(),
    animating: false,
    speed: 1,
};

export const animationSlice = createSlice({
    name: 'animation',
    initialState,
    reducers: {
        setSpeed: (state, action: PayloadAction<number>) =>
        {
            state.speed = action.payload;
        },

        start: (state) =>
        {
            state.animating = true;
            // unpause();
        },

        pause: (state) =>
        {
            if (state.animating) 
            {
                // pause();
            }
        },

        stop: (state) =>
        {
            state.animating = false;
            // stop all pause()
        },
    },
});

export const { setSpeed, start, pause, stop } = animationSlice.actions;
export default animationSlice.reducer;