import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UnweightedEdge from '../graphs/unweighted/Edge';
import WeightedEdge from '../graphs/weighted/Edge';

class IntStream 
{
    private _tokens: number[];

    constructor(input: string) 
    {
        this._tokens = input.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
    }

    next(condition?: (value: number) => boolean): number | undefined 
    {
        while (this._tokens.length) 
        {
            const value = this._tokens.shift();
            if (value !== undefined && (condition === undefined || condition(value)))
            {
                return value;
            }
        }
        return undefined;
    }

    nextCount(): number 
    {
        return this.next(n => n > 0) ?? 0;
    }

    nextVertex(n: number): number | undefined 
    {
        return this.next(v => v > 0 && v <= n);
    }
}

export interface GraphStateBase 
{
    vertexCount: number;
    directed: boolean;
    weighted: boolean;
}

export interface WeightedGraphState
{
    edges: WeightedEdge[];
    weighted: true;
}

export interface UnweightedGraphState
{
    edges: UnweightedEdge[];
    weighted: false;
}

export type GraphState = GraphStateBase & (WeightedGraphState | UnweightedGraphState);

const initialState: GraphState = {
    vertexCount: 0,
    edges: [],
    directed: false,
    weighted: false,
};

export const graphSlice = createSlice({
    name: 'graph',
    initialState: initialState as GraphState,
    reducers: {
        setDirected: (state, action: PayloadAction<boolean>) =>
        {
            state.directed = action.payload;
        },

        setGraph: (state, action: PayloadAction<{ input: string, weighted: boolean }>) => 
        {
            const { input, weighted } = action.payload;

            const stream = new IntStream(input);

            state.vertexCount = stream.nextCount();
            state.weighted = weighted;

            const m = stream.nextCount();

            if (state.weighted)
            {
                const graph: WeightedEdge[] = [];
                for (let i = 0; i < m; i++)
                {
                    const u = stream.nextVertex(state.vertexCount), v = stream.nextVertex(state.vertexCount), weight = stream.next();
                    if (!u || !v || !weight)
                    {
                        break;
                    }
        
                    graph.push({ u, v, weight });
                }

                state.edges = graph;
            }
            else
            {
                const graph: UnweightedEdge[] = [];
                for (let i = 0; i < m; i++)
                {
                    const u = stream.nextVertex(state.vertexCount), v = stream.nextVertex(state.vertexCount);
                    if (!u || !v)
                    {
                        break;
                    }
        
                    graph.push({ u, v });
                }

                state.edges = graph;
            }
        },
    },
});

export const { setDirected, setGraph } = graphSlice.actions;
export default graphSlice.reducer;