Hướng dẫn thêm thuật toán:

# Bước 1: Khai báo `class`

Khai báo thuật toán trong folder `lib/algorithms` bằng 1 file gồm 2 `class` sau:
1. `class` cấu hình những tham số như đỉnh bắt đầu.
2. `class` thuật toán chính cần `extends` 1 trong 2 `class` sau đây:
    - `NeutralGraphAlgorithm<T>`: thuật toán này có thể dùng cho cả đồ thị không trọng số và có trọng số.
    - `WeightedGraphAlgorithm<T>`: thuật toán này chỉ áp dụng được với đồ thị có trọng số.

**(`T` là class cấu hình ở trên.)**

# Bước 2: Thiết lập các dữ liệu liên quan

Mỗi `class` thuật toán gồm 4 trường dữ liệu có thể `override` tùy theo thuật toán:

```ts
export abstract class GraphAlgorithm<Config = object>
{
    public abstract get name(): string; // Tên của thuật toán
    public get code(): string
    {
        return ''; // mã C dùng để tham khảo
    }

    public get predicate(): AlgorithmRequirements
    {
        return { }; // Điều kiện của đồ thị
    }

    public configNode(): ReactNode
    {
        return (<></>); // Component React dùng để nhập tham số cấu hình
    }
    
    public abstract run(g: GraphState, config: Config): IterableIterator<AlgorithmStep>; // Hàm chạy thuật toán, nói sau
};
```

## `public abstract get name(): string`
- Trả về: tên thuật toán.

## `public get code(): string`
- Trả về: đoạn code C để tham khảo bước chạy.

Để có thể ghi nhiều dòng thì làm như sau
```ts
public get code(): string
{
    return `Dòng 1
Dòng 2`;
}
```

## `public get predicate(): AlgorithmRequirements`
- Trả về: điều kiện để thuật toán có thể chạy.

Điều kiện thuật toán có cấu trúc sau:
```ts
/*
Với mỗi giá trị sẽ có ý nghĩa khác nhau:
undefined / để trống: không quan trọng
true: phải có
false: không được có
*/
export interface AlgorithmRequirements
{
    directed?: boolean; // Đồ thị phải là có hướng / vô hướng
    weighted?: boolean; // Đồ thị phải có trọng số / không có trọng số
    acyclic?: boolean; // Đồ thị phải không có chu trình / có chu trình (dành cho sắp xếp topo, gán false đồng nghĩa với để trống)
}
```

## `public configNode(): ReactNode`
- Trả về: một component React dùng để tạo ra cấu hình.

Đặt trong điều kiện lý tưởng là mỗi dòng chỉ có 1 loại tham số, thì cấu trúc thông thường sẽ như sau:

```tsx
public override configNode(): ReactNode
{
    return (
        <>
            <Form.Item<{/* class cấu hình */}> label={/* Tên đỉnh */} name={/* Tên tham số ở trên class cấu hình */}>
                {/* Component của 1 tham số trong cấu hình */}
            </Form.Item>

            <Form.Item<{/* class cấu hình */}> label={/* Tên đỉnh */} name={/* Tên tham số ở trên class cấu hình */}>
                {/* Component của 1 tham số trong cấu hình */}
            </Form.Item>

            {/* ... */}
        </>
    )
}
```
**Lưu ý:** dấu `<>` và `</>` phải ghi chính xác như thế.

**Lưu ý 2:** để thống nhất giữa UI thì mọi người vào [đây](https://ant.design/components/overview/) để nghiên cứu các component và sử dụng nó, cụ thể ở mục **Data Entry**.
# Bước 3: Định nghĩa hàm chạy thuật toán
Đây là thứ quan trọng nhất trong `class` thuật toán, rõ ràng :)

Hàm chạy thuật toán sẽ được định nghĩa trong hàm `_run` (để ý dấu `_`) với cấu trúc như sau:
    
1. Nếu là `NeutralGraphAlgorithm<Config>`: `protected override *_run(g: UnweightedGraph, config: Config): IterableIterator<AlgorithmStep>`
2. Nếu là `WeightedGraphAlgorithm<Config>`: `protected override *_run(g: WeightedGraph, config: Config): IterableIterator<AlgorithmStep>`

Giải thích các tham số:
    
- `g: UnweightedGraph`: đồ thị không trọng số.
- `g: WeightedGraph`: đồ thị có trọng số.
- `config: Config`: cấu hình với kiểu là class cấu hình bên trên.
- `AlgorithmStep`: là một bước chạy của thuật toán, dùng để biểu diễn ra cho người dùng thấy, với cấu trúc sau:
```ts
// Tô màu {color} cho đỉnh {vertex} 
export type ColorVertexAnimation = [vertex: number, color: KEYWORD]; 

// Tô màu {color} cho cạnh "đầu tiên" nối {u} với {v}
export type ColorEdgeAnimation = [u: number, v: number, color: KEYWORD];

// Tô đậm đỉnh {vertex}
// Nếu tô đậm thì highlight = true
// Nếu không tô đậm thì highlight = false
export type HighlightVertexAnimation = [vertex: number, highlight: boolean];

// Tô đậm cạnh "đầu tiên" nối {u} với {v}
// Nếu tô đậm thì highlight = true
// Nếu không tô đậm thì highlight = false
export type HighlightEdgeAnimation = [u: number, v: number, highlight: boolean];

// Thêm một biến có tên {name} và giá trị khởi tạo {value} với {scope} cục bộ (local - trong hàm) hoặc toàn cục (global - ngoài hàm)
export type AddVariableAnimation = [name: string, value: Primitive | { type: SequenceType, value: ArrayType }, scope: 'local' | 'global'];

// Xóa biến tên {name} trong {scope}
export type RemoveVariableAnimation = [name: string, scope: 'local' | 'global'];

// Cập nhật biến tên {name} trong {scope} thành giá trị {value}
export type UpdateVariableAnimation = [name: string, value: Variable, scope: 'local' | 'global'];

// Giá trị nhập vào có thể là một phần tử đó hoặc một mảng chứa phần tử đó
type ArrayOrSingle<T> = T | T[];

export interface AlgorithmStep
{
    colorVertex?: ArrayOrSingle<ColorVertexAnimation>; // tô màu đỉnh
    colorEdge?: ArrayOrSingle<ColorEdgeAnimation>; // tô màu cạnh
    highlightVertex?: ArrayOrSingle<HighlightVertexAnimation>; // tô đậm đỉnh
    highlightEdge?: ArrayOrSingle<HighlightEdgeAnimation>; // tô đậm cạnh
    codeLine?: number; // tô đậm dòng mã giả nào (bắt đầu từ số 0)

    addVariable?: ArrayOrSingle<AddVariableAnimation>; // thêm biến
    removeVariable?: ArrayOrSingle<RemoveVariableAnimation>; // xóa biến
    updateVariable?: ArrayOrSingle<UpdateVariableAnimation>; // cập nhật biến
    pushStackTrace?: string; // thêm 1 lần gọi hàm
    popStackTrace?: boolean; // bỏ 1 lần gọi hàm
}
```

Ví dụ để thông não (thuật toán BFS):
```ts
// Nhớ phải có dấu *
*_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>
{
    yield { codeLine: 3, pushStackTrace: `BFS(G, ${startVertex})` }; // gọi hàm BFS
    const queue: Queue<number> = new Queue<number>();
    yield { codeLine: 4, addVariable: ['Q', { type: SequenceType.Queue, value: [] }, 'local'] }; // khai báo biến cục bộ Q là hàng đợi
    
    queue.push(startVertex);
    yield { 
        codeLine: 6,
        highlightVertex: [startVertex, true],
        colorVertex: [startVertex, 'orange'],
        updateVariable: ['Q', queue.toArray(), 'local']
    }; // tô đậm đỉnh bắt đầu, tô màu cam cho đỉnh bắt đầu, cập nhật biến Q
    
    yield { codeLine: 8 };
    while (!queue.isEmpty())
    {
        const u = queue.shift()!;

        yield { 
            codeLine: 9,
            highlightVertex: [u, true],
            colorVertex: [u, 'yellow'],
            addVariable: ['u', u, 'local'],
            updateVariable: ['Q', queue.toArray(), 'local']    
        };

        yield { codeLine: 10 };
        if (visited[u])
        {
            yield { codeLine: 11 };
            continue;
        }

        visited[u] = true;
        yield {
            colorVertex: [u, 'red'],
            colorEdge: parent[u] !== -1 ? [parent[u], u, 'red'] : undefined,
            codeLine: 13,
            updateVariable: ['visited', visited, 'local']
        };

        yield {
            codeLine: 15,
            addVariable: ['v', 1, 'local']
        };
        for (let v = 1; v <= g.vertexCount; v++)
        {
            yield {
                codeLine: 16, 
                highlightVertex: [v, true],
                highlightEdge: [u, v, true] 
            };

            if (g.matrix[u][v] && !visited[v])
            {
                queue.push(v);

                let colorEdge = {};

                if (parent[v] === -1)
                {
                    parent[v] = u;
                    colorEdge = {
                        colorEdge: [u, v, 'blue'],
                    };
                }

                yield { 
                    codeLine: 17,
                    colorVertex: [v, 'orange'],
                    updateVariable: ['Q', queue.toArray(), 'local'],
                    ...colorEdge
                };
            }
            yield { codeLine: 15, highlightVertex: u !== v ? [v, false]: undefined, highlightEdge: [u, v, false], updateVariable: ['v', v + 1, 'local'] };
        }

        yield { 
            codeLine: 18, 
            highlightVertex: [u, false],
            colorVertex: [u, 'purple'],
            removeVariable: [['v', 'local']]
        };

        yield { codeLine: 8, removeVariable: ['u', 'local'] };
    }

    yield { codeLine: 19, popStackTrace: true };
}
```

# Bước 4: Khai báo thuật toán
Qua bên file `lib/context/GraphTheoryProvider` sẽ thấy đoạn sau đây:
```ts
export const AvailableAlgorithms = [
    // các thuật toán
];
```

Sử dụng `new` để tạo 1 instance của thuật toán và đặt vào mảng đó, refresh lại trang, và xong!

# Bước 5: ???