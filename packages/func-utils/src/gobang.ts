
const add = (a: number, b: number) => {
    return (a + b)
}
export {
    add
}

interface CanvasOptions {
    zIndex?: string
    width?: number
    height?: number
    bgColor?: string
}

interface CanvasAndCtx {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D | null
}

type Point = 0 | 1 | 2

interface GobangOptions {
    rows: number
    cols: number
    bgColor?: string
    lineColor?: string
    itemGap?: number
}

class Gobang {
    rows: number
    cols: number
    itemGap: number
    canvasBoard: HTMLCanvasElement | null
    ctxBoard: CanvasRenderingContext2D | null
    canvasChess: HTMLCanvasElement | null
    ctxChess: CanvasRenderingContext2D | null
    wrapper: HTMLElement | null
    bgColor: string
    lineColor: string
    borderWidth = 20
    board: Point[][]
    boardProxy: Point[][]
    constructor({ rows, cols, itemGap, bgColor, lineColor }: GobangOptions) {
        this.rows = rows
        this.cols = cols
        this.itemGap = itemGap || 20
        this.canvasBoard = null
        this.canvasChess = null
        this.ctxBoard = null
        this.ctxChess = null
        this.wrapper = null
        this.bgColor = bgColor || '#ccc'
        this.lineColor = lineColor || '#000'
        this.board = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0))
        this.boardProxy = this.reactive(this.board)
        this.init()
    }
    // 添加响应式
    reactive(board: Point[][]) {
        const self = this
        return board.map((arr, index) => {
            return new Proxy(arr, {
                set(target: Point[], prop: PropertyKey, value: Point): boolean {
                    self.trigger(index, prop as number, value)
                    return Reflect.set(target, prop, value)
                }
            })
        })
    }
    // 触发依赖
    trigger(row: number, col: number, value: Point) {
        console.log({
            row,
            col,
            value
        })
    }
    downChess() {

    }
    initBoard() {
        (this.ctxBoard as CanvasRenderingContext2D).strokeStyle = '#000'
        this.ctxBoard?.beginPath()
        for (let i = 0; i <= this.rows; i++) {
            this.ctxBoard?.moveTo(this.borderWidth / 2, i * this.itemGap + this.borderWidth / 2)
            this.ctxBoard?.lineTo(this.borderWidth / 2 + this.rows * this.itemGap, this.borderWidth / 2 + i * this.itemGap)
            this.ctxBoard?.moveTo(this.borderWidth / 2 + i * this.itemGap, this.borderWidth / 2)
            this.ctxBoard?.lineTo(this.borderWidth / 2 + i * this.itemGap, this.borderWidth / 2 + this.rows * this.itemGap)
        }
        (this.ctxBoard as CanvasRenderingContext2D).stroke();
    }
    createCanvasIns({ zIndex, bgColor }: CanvasOptions): CanvasAndCtx {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = this.itemGap * this.rows + this.borderWidth
        canvas.height = this.itemGap * this.cols + this.borderWidth
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        canvas.style.backgroundColor = bgColor || '#eee'
        canvas.style.zIndex = zIndex || '1';
        return { canvas, ctx }
    }
    init() {
        this.wrapper = document.createElement('div')
        this.wrapper.style.position = 'relative'
        this.wrapper.style.width = `${this.itemGap * this.rows + this.borderWidth}px`
        this.wrapper.style.height = `${this.itemGap * this.cols + this.borderWidth}px`
        const { canvas, ctx } = this.createCanvasIns({})
        this.canvasBoard = canvas
        this.ctxBoard = ctx
        this.initBoard()
        this.wrapper.appendChild(this.canvasBoard)
        const { canvas: canvasChess, ctx: ctxChess } = this.createCanvasIns({ zIndex: '2', bgColor: 'transparent' })
        this.canvasChess = canvasChess
        this.ctxChess = ctxChess
        this.wrapper.appendChild(this.canvasChess)
    }
    mount(node: HTMLElement) {
        if (this.wrapper) {
            node.appendChild(this.wrapper)
        }
    }
    isWin() { }
    tip() { }

}

export default Gobang