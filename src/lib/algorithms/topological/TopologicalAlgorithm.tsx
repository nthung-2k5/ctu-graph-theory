import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from "../GraphAlgorithm";
import { UnweightedGraph } from "../UnweightedGraph";

export default abstract class TopologicalAlgorithm extends NeutralGraphAlgorithm<object, number[]> 
{
    public override defaultConfig(): object
    {
        return {};
    }

    public override get predicate(): AlgorithmRequirements 
    {
        return { 
            directed: true, // Đồ thị phải là có hướng
            acyclic: true, // Đồ thị không được có chu trình 
        }; // Điều kiện của đồ thị
    }

    protected abstract _topologicalSort(g: UnweightedGraph, inDegree: number[], result: number[]): IterableIterator<AlgorithmStep>;

    protected override *_run(g: UnweightedGraph, _config: object, result: number[]): IterableIterator<AlgorithmStep> 
    {
        const inDegree = Array(g.vertexCount + 1).fill(0);
        yield* this._topologicalSort(g, inDegree, result);
    }
}