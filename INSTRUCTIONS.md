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
    public get pseudocode(): PseudocodeLine[]
    {
        return []; // Mã giả
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

## `public get pseudocode(): PseudocodeLine[]`
- Trả về: mảng các dòng mã giả.

Mỗi dòng mã giả có cấu trúc sau:
```ts
export interface PseudocodeLine
{
    text: string; // Dòng mã giả
    tab: number; // Số lần thụt lề tab
    comment?: boolean; // Dòng này là comment (có thể để trống, ngầm định là không phải)
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

// Giá trị nhập vào có thể là một phần tử đó hoặc một mảng chứa phần tử đó
type ArrayOrSingle<T> = T | T[];

export interface AlgorithmStep
{
    colorVertex?: ArrayOrSingle<ColorVertexAnimation>; // tô màu đỉnh
    colorEdge?: ArrayOrSingle<ColorEdgeAnimation>; // tô màu cạnh
    highlightVertex?: ArrayOrSingle<HighlightVertexAnimation>; // tô đậm đỉnh
    highlightEdge?: ArrayOrSingle<HighlightEdgeAnimation>; // tô đậm cạnh
    codeLine?: number; // tô đậm dòng mã giả nào (bắt đầu từ số 0)
}
```

Ví dụ để thông não (thuật toán BFS):
```ts
// Nhớ phải có dấu *
*_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>
{
    const queue: Queue<number> = new Queue<number>();

    queue.push(startVertex);
    
    yield { codeLine: 0 }; // Tô đậm dòng đầu của mã giả
    while (!queue.isEmpty())
    {
        const u = queue.shift()!;
        yield { codeLine: 1, highlightVertex: [u, true] }; // Tô đậm dòng 2 của mã giả và tô đậm đỉnh u

        yield { codeLine: 2 }; // Tô đậm dòng 3 của mã giả
        if (visited[u])
        {
            yield { codeLine: 3 }; // Tô đậm dòng 4 của mã giả
            yield { codeLine: 0 }; // Tô đậm dòng đầu của mã giả (ám chỉ thực hiện lại vòng lặp)
            continue;
        }

        yield {
            colorVertex: [u, 'red'],
            colorEdge: parent[u] !== -1 ? [parent[u], u, 'red'] : undefined,
            codeLine: 4
        }; // Tô màu đỏ cho đỉnh u, tô màu cạnh nối giữa cha của u với u (nếu tồn tại cha), tô đậm dòng 5 của mã giả

        visited[u] = true;
        yield { codeLine: 5 }; // Tô đậm dòng 6 của mã giả

        const neighbors = g.neighbors(u);

        yield { codeLine: 6 }; // Tô đậm dòng 7 của mã giả
        for (const v of neighbors)
        {
            yield { highlightVertex: [v, true], codeLine: 7 }; // Tô đậm đỉnh v, Tô đậm dòng 8 của mã giả
            if (!visited[v])
            {
                queue.push(v);
                yield {
                    colorVertex: parent[v] === -1 ? [v, 'blue'] : undefined,
                    colorEdge: parent[v] === -1 ? [u, v, 'blue'] : undefined,
                    codeLine: 8
                };
                // Tô màu xanh cho đỉnh v nếu chưa vào hàng đợi lần nào.
                // Tô màu cạnh nối từ u đến v nếu v chưa vào hàng đợi lần nào.
                // Tô màu dòng 9 của mã giả

                if (parent[v] === -1)
                {
                    parent[v] = u;
                }
            }
            yield { codeLine: 6, highlightVertex: [v, false] }; // Tô màu dòng 7 của mã giả, hủy tô đậm đỉnh v.
        }

        yield { codeLine: 0, highlightVertex: [u, false] }; // Tô màu dòng đầu của mã giả (lặp lần tiếp theo), hủy tô đậm đỉnh u.
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