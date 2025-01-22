import { ElementDefinition } from 'cytoscape';
import { ReactNode } from 'react';

export default interface Graph
{
    toGraph(): ElementDefinition[];
    toMemoryGraph(): ReactNode;
    equals(other: Graph): boolean;
    neighbors(u: number): number[];
    
    get weighted(): boolean;
    get directed(): boolean;
    get vertexCount(): number;
    get edgeCount(): number;
}