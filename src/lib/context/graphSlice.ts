import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UnweightedEdge from '../graphs/unweighted/Edge';
import WeightedEdge from '../graphs/weighted/Edge';
import { ElementDefinition } from 'cytoscape';
import { uuidv7 } from 'uuidv7';

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

const toCytoscapeElements = (graph: GraphState): ElementDefinition[] =>
{
    const elements: ElementDefinition[] = [];
                
    for (let i = 1; i <= graph.vertexCount; i++) 
    {
        elements.push({ group: 'nodes', data: { id: i.toString(), label: i.toString() } });
    }

    for (let i = 0; i < graph.edges.length; i++)
    {
        const edge = graph.edges[i];
        const el: ElementDefinition = { group: 'edges', data: { id: uuidv7(), source: edge.u.toString(), target: edge.v.toString() }, classes: graph.directed ? 'directed' : '' };
        
        el.data.label = graph.weighted ? graph.edges[i].weight.toString() : '';
        el.data.labelOverride = '';
        
        elements.push(el);
    }

    return elements;
}

export interface GraphStateBase 
{
    vertexCount: number;
    directed: boolean;
    weighted: boolean;
    elements: ElementDefinition[];
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
    elements: [],
};

export const graphSlice = createSlice({
    name: 'graph',
    initialState: initialState as GraphState,
    reducers: {
        setDirected: (state, action: PayloadAction<boolean>) =>
        {
            state.directed = action.payload;
            state.elements = toCytoscapeElements(state);
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

            state.elements = toCytoscapeElements(state);
        },
    },
});

export const { setDirected, setGraph } = graphSlice.actions;
export default graphSlice.reducer;