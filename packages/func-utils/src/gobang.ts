
const add = (a: number, b: number) => {
    return (a + b)
}
export {
    add
}

type Point = 0 | 1 | 2

interface GobangOptions {
    rows: number
    cols: number
    width: number
    height: number
    bgColor?: string
    lineColor?: string
    itemGap?: number
}

class Gobang {
    rows: number
    cols: number
    itemGap: number
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
    bgColor: string
    lineColor: string
    borderWidth = 20
    board: Point[][]
    boardProxy: Point [] []
    constructor({ rows, cols, itemGap, bgColor, lineColor }: GobangOptions) {
        this.rows = rows
        this.cols = cols
        this.itemGap = itemGap || 20
        this.canvas = null
        this.ctx = null
        this.bgColor = bgColor || '#ccc'
        this.lineColor = lineColor || '#000'
        this.board = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0))
        this.boardProxy = this.reactive(this.board)
        this.init()
    }
    // 添加响应式
    reactive (board: Point [] []) {
        const self = this
        return board.map((arr, index) => {
            return new Proxy(arr, {
                set (target: Point [], prop: PropertyKey, value: Point): boolean {
                    self.trigger(index, prop as number, value)
                    return Reflect.set(target, prop, value)
                }
            })
        })
    }
    // 触发依赖
    trigger (row: number, col: number, value: Point) {
        console.log({
            row,
            col,
            value
        })
    }
    downChess () {
        
    }
    initBoard () {

    }
    init() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.itemGap * this.rows + this.borderWidth
        this.canvas.height = this.itemGap * this.cols + this.borderWidth
        this.canvas.style.backgroundColor = this.bgColor
        this.ctx = this.canvas.getContext('2d')
        console.log({
            canvas: this.canvas
        })
    }
    mount(node: HTMLElement) {
        if (this.canvas) {
            node.appendChild(this.canvas)
        }
    }
    isWin() { }
    tip() { }

}

export default Gobang