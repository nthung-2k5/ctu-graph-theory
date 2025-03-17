/* eslint-disable react-hooks/rules-of-hooks */
import { TreeMultiMap } from 'data-structure-typed';
import { WeightedGraphAlgorithm } from '../GraphAlgorithm';
import cytoscape from 'cytoscape';
import { ReactNode, useRef, useEffect } from 'react';

export interface MSTResult 
{
    // Lưu cây khung bằng TreeMap vì map nó sắp xếp tăng dần theo key sẵn.
    // Tụi mình đỡ sort
    // TreeMultiMap<number1, [number2, number3]>
    // number1: đỉnh u, number2: đỉnh v, number3: trọng số
    tree: TreeMultiMap<number, [number, number]>;
    totalWeight: number;
}

export abstract class MSTAlgorithm<Config> extends WeightedGraphAlgorithm<Config, MSTResult>
{
    protected override _initResult(): MSTResult
    {
        return {
            tree: new TreeMultiMap<number, [number, number]>(),
            totalWeight: 0,
        };
    }

    protected override _result(result: MSTResult): ReactNode
    {
        const cyRef = useRef<HTMLDivElement>(null);
    
        const tree: TreeMultiMap<number, [number, number]> = result.tree;
        const elements: cytoscape.ElementDefinition[] = [];
        const nodes = new Set<number>();
    
        for (const [source, values] of tree.entries()) 
        {
            if (!values) continue; // Kiểm tra nếu giá trị là undefined (tránh lỗi)
    
            for (const [target, weight] of values) 
            {
                nodes.add(source);
                nodes.add(target);
                elements.push({
                    data: {
                        id: `${source}-${target}`,
                        source: `${source}`,
                        target: `${target}`,
                        label: `${weight}`,
                    },
                });
            }
        }
    
        nodes.forEach((node) => 
        {
            elements.push({ data: { id: `${node}` } });
        });
    
        useEffect(() => 
        {
            const cy = cytoscape({
                container: cyRef.current,
                elements: elements,
                style: [
                    {
                        selector: "node",
                        style: {
                            label: "data(id)",
                            "background-color": "#ffffff",
                            "text-valign": "center",
                            "text-halign": "center",
                            color: "#000000",
                            "border-width": 2,
                            "border-color": "#000000",
                            width: 40,
                            height: 40,
                            "font-size": "18px",
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                            label: "data(label)",
                            "curve-style": "bezier",
                            "target-arrow-shape": "none",
                            "line-color": "#000000",
                            "text-background-color": "#ffffff",
                            "text-background-opacity": 1,
                            "text-background-padding": "3px",
                            "font-size": "18px",
                            width: 2,
                        },
                    },
                ],
                layout: { name: "circle" },
            });
    
            return () => cy.destroy();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    
        return (
            <>
                <p>Danh sách cung trong cây khung nhỏ nhất:</p>
                {[...tree].map(([key, values]) => (
                    <div key={key}>
                        {(values || []).map((value, index) => (
                            <p key={index}>
                                {key} - {value[0]} (trọng số = {value[1]})
                            </p>
                        ))}
                    </div>
                ))}
                <p>Tổng trọng số cây khung nhỏ nhất: {result.totalWeight}</p>
    
                <p>Đồ thị biểu diễn cây khung nhỏ nhất:</p>
                <div
                    ref={cyRef}
                    className='w-full h-[300px] border rounded-lg'
                />
            </>
        );
    }
}