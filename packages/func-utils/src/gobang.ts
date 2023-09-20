
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
// 1 黑 
// 2 白
// 0 空
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
    chessRadius = 5
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
                    self.trigger(prop as number, index, value)
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
        this.drawChessByRowCol(value, row, col)
    }
    // 悔棋 根据位置
    deleteChessByChessPosition(x: number, y: number) {
        x = x - this.chessRadius
        y = y - this.chessRadius;
        console.log(x, y);
        (this.ctxChess as CanvasRenderingContext2D).clearRect(x, y, 2 * this.chessRadius, 2 * this.chessRadius)
    }
    // 根据行列
    deleteChessByChessRowCol(row: number, col: number) {
        const x = this.getPositionByItem(col)
        const y = this.getPositionByItem(row)
        console.log({
            row,
            col,
            x,
            y
        })
        this.deleteChessByChessPosition(x, y)
    }

    getPositionByItem(rowOrCol: number) {
        return rowOrCol * this.itemGap + this.borderWidth / 2
    }

    drawChessByRowCol(chessType: Point, row: number, col: number) {
        console.log('entry', chessType)
        // 如果有值，说明这个点有棋子
        if (this.boardProxy[col][row] && chessType !== 0) {
            return
        }
        // 只能1 2
        if (chessType === 0) {
            this.deleteChessByChessRowCol(row, col)
            return
        }
        const x = this.getPositionByItem(col)
        const y = this.getPositionByItem(row)
        this.drawChess(chessType, x, y)
    }
    drawChess(chessType: Point, x: number, y: number) {
        (this.ctxChess as CanvasRenderingContext2D).fillStyle = chessType === 1 ? '#111' : '#eee';
        (this.ctxChess as CanvasRenderingContext2D).beginPath();
        (this.ctxChess as CanvasRenderingContext2D).arc(x, y, this.chessRadius, 0, 2 * Math.PI);
        this.ctxChess?.fill();
    }
    initBoard() {
        (this.ctxBoard as CanvasRenderingContext2D).strokeStyle = '#eee'
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
        canvas.style.backgroundColor = bgColor || '#fff'
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
