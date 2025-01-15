import UnweightedGraph from '../UnweightedGraph';

export default interface GraphAlgorithm
{
    name: string;
    predicateCheck(g: UnweightedGraph): { valid: boolean, errors?: string[] };
    run(g: UnweightedGraph): void;
}