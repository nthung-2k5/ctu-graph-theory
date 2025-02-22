import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GraphConfigState 
{
    nodeColor: string;
    edgeColor: string;
    labelColor: string;

    nodeRadius: number;
    edgeLength: number;
};

const initialState: GraphConfigState = {
    nodeColor: '#ffffff',
    edgeColor: '#000000',
    labelColor: '#000000',

    nodeRadius: 30,
    edgeLength: 100,
};

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setNodeColor: (state, action: PayloadAction<string>) =>
        {
            state.nodeColor = action.payload;
        },

        setEdgeColor: (state, action: PayloadAction<string>) =>
        {
            state.edgeColor = action.payload;
        },

        setLabelColor: (state, action: PayloadAction<string>) =>
        {
            state.labelColor = action.payload;
        },

        setNodeRadius: (state, action: PayloadAction<number>) =>
        {
            state.nodeRadius = action.payload;
        },

        setEdgeLength: (state, action: PayloadAction<number>) =>
        {
            state.edgeLength = action.payload;
        },
    },
});

export const { setNodeColor, setEdgeColor, setLabelColor, setNodeRadius, setEdgeLength } = configSlice.actions;
export default configSlice.reducer;