Hướng dẫn thêm thuật toán:

# Bước 1: Khai báo `class`

Khai báo thuật toán trong folder `lib/algorithms` bằng 1 file gồm 2 `class` sau:
1. `class` cấu hình những tham số như đỉnh bắt đầu.
2. `interface` chứa những kết quả định trả về.
2. `class` thuật toán chính cần `extends` 1 trong 2 `class` sau đây:
    - `NeutralGraphAlgorithm<T, R>`: thuật toán này có thể dùng cho cả đồ thị không trọng số và có trọng số.
    - `WeightedGraphAlgorithm<T, R>`: thuật toán này chỉ áp dụng được với đồ thị có trọng số.

**(`T` là class cấu hình ở trên, R là interface kết quả ở trên.)**

# Bước 2: Thiết lập các dữ liệu liên quan

Mỗi `class` thuật toán gồm 4 trường dữ liệu có thể `override` tùy theo thuật toán:

```ts
export abstract class GraphAlgorithm<Config = object, R = any>
{
    public abstract get name(): string; // Tên của thuật toán
    public abstract defaultConfig(): Config;
    protected abstract _result(result: R): ReactNode; // Component React dùng để hiển thị kết quả

    public get Result(): React.FC<{ result: R }> // Không quan trọng, bỏ qua
    {
        return memo((props: { result: R }) => this._result(props.result));
    }

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
    
    public abstract run(g: GraphState, config: Config): [IterableIterator<AlgorithmStep>, R]; // Hàm chạy thuật toán, nói sau
};
```

## `public abstract get name(): string`
- Trả về: tên thuật toán.

## `public abstract defaultConfig(): Config`
- Trả về: cấu hình mặc định khi mới chọn thuật toán.

## `protected abstract _result(result: R): ReactNode`
- Trả về: một component React dùng để hiện thị kết quả từ `result` bên trên.

## `public get code(): string`
- Trả về: đoạn code C (hoặc mã giả) để tham khảo bước chạy.

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
    
1. Nếu là `NeutralGraphAlgorithm<Config, R>`: `protected override *_run(g: UnweightedGraph, config: Config, result: R): IterableIterator<AlgorithmStep>`
2. Nếu là `WeightedGraphAlgorithm<Config, R>`: `protected override *_run(g: WeightedGraph, config: Config, result: R): IterableIterator<AlgorithmStep>`

Giải thích các tham số:
    
- `g: UnweightedGraph`: đồ thị không trọng số.
- `g: WeightedGraph`: đồ thị có trọng số.
- `config: Config`: cấu hình với kiểu là class cấu hình bên trên.
-  `result: R`: kết quả trả về thuật toán. Trong lúc chạy phải nạp kết quả vào đây để có thể hiển thị ra.
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

// Giá trị nhập vào có thể là một phần tử đó hoặc một mảng chứa phần tử đó
type ArrayOrSingle<T> = T | T[];

export interface AlgorithmStep
{
    colorVertex?: ArrayOrSingle<ColorVertexAnimation>; // tô màu đỉnh
    colorEdge?: ArrayOrSingle<ColorEdgeAnimation>; // tô màu cạnh
    highlightVertex?: ArrayOrSingle<HighlightVertexAnimation>; // tô đậm đỉnh
    highlightEdge?: ArrayOrSingle<HighlightEdgeAnimation>; // tô đậm cạnh

    codeLine?: number; // tô đậm dòng mã giả nào (bắt đầu từ số 1)

    log: string; // ghi phần log cho từng bước (chỉ 1 dòng, và luôn bắt buộc)
}
```

Ví dụ để thông não (thuật toán BFS):
```ts
// Nhớ phải có dấu *
*_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[], traverseOrder: number[]): IterableIterator<AlgorithmStep>
{
    yield {
        codeLine: 3,
        log: `BFS(G, ${startVertex})`
    };
    const queue: Queue<number> = new Queue<number>();
    yield {
        codeLine: 4,
        log: `Q = {}`
    };
    
    queue.push(startVertex);
    yield { 
        codeLine: 6,
        highlightVertex: [startVertex, true],
        colorVertex: [startVertex, 'orange'],
        log: `Q = {${startVertex}}`
    };
    
    yield {
        codeLine: 8,
        log: `Q = {${startVertex}} => Bắt đầu duyệt`
    };
    while (!queue.isEmpty())
    {
        const u = queue.shift()!;

        yield { 
            codeLine: 9,
            highlightVertex: [u, true],
            colorVertex: [u, 'yellow'], 
            log: `u = ${u}, Q = {${queue.toArray().join(', ')}}`
        };

        yield {
            codeLine: 10,
            log: `mark[${u}] = ${visited[u]}`
        };
        if (visited[u])
        {
            yield { codeLine: 11, log: `Đã duyệt ${u}, bỏ qua` };
            continue;
        }

        visited[u] = true;
        traverseOrder.push(u);
        
        yield {
            colorVertex: [u, 'red'],
            colorEdge: parent[u] !== -1 ? [parent[u], u, 'red'] : undefined,
            codeLine: 13,
            log: `mark[${u}] = true`
        };

        yield {
            codeLine: 15,
            log: `v = 1`
        };
        for (let v = 1; v <= g.vertexCount; v++)
        {
            yield {
                codeLine: 16, 
                highlightVertex: [v, true],
                highlightEdge: [u, v, true],
                log: `G->A[${u}][${v}] = ${g.matrix[u][v]}, mark[${v}] = ${visited[v]}`
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
                    ...colorEdge,
                    log: `Q = {${queue.toArray().join(', ')}}`
                };
            }
            yield { codeLine: 15, highlightVertex: u !== v ? [v, false]: undefined, highlightEdge: [u, v, false], log: `v = ${v + 1}` };
        }

        yield { 
            codeLine: 18, 
            highlightVertex: [u, false],
            colorVertex: [u, 'purple'],
            log: `Kết thúc duyệt ${u}`
        };

        yield { codeLine: 8, log: `Q = {${queue.toArray().join(', ')}}` };
    }

    yield { codeLine: 19, log: 'Kết thúc' };
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