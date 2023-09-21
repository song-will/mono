
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
    strokeStyle = '#eee'
    nextChessType: Point = 2
    constructor({ rows, cols, itemGap, bgColor, lineColor }: GobangOptions) {
        this.rows = rows
        this.cols = cols
        this.itemGap = itemGap || 20
        this.canvasBoard = null
        this.canvasChess = null
        this.ctxBoard = null
        this.ctxChess = null
        this.wrapper = null
        this.bgColor = bgColor || '#fff'
        this.lineColor = lineColor || '#fff'
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
                    self.trigger(Number(prop), index, value)
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
        console.log('isWin', this.isWin([col, row], value))
    }
    // 悔棋 根据位置
    deleteChessByChessPosition(x: number, y: number) {
        x = x - this.chessRadius
        y = y - this.chessRadius
        console.log(x, y)
        this.ctxChess!.clearRect(x, y, 2 * this.chessRadius, 2 * this.chessRadius)
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
        this.toggleChessType()
        this.drawChess(chessType, x, y)
    }
    drawChess(chessType: Point, x: number, y: number) {
        this.ctxChess!.fillStyle = chessType === 1 ? '#111' : '#eee'
        this.ctxChess!.beginPath()
        this.ctxChess!.arc(x, y, this.chessRadius, 0, 2 * Math.PI)
        this.ctxChess?.fill()
    }
    initBoard() {
        this.ctxBoard!.strokeStyle = this.strokeStyle
        this.ctxBoard?.beginPath()
        for (let i = 0; i <= this.rows; i++) {
            this.ctxBoard?.moveTo(this.borderWidth / 2, i * this.itemGap + this.borderWidth / 2)
            this.ctxBoard?.lineTo(this.borderWidth / 2 + this.rows * this.itemGap, this.borderWidth / 2 + i * this.itemGap)
            this.ctxBoard?.moveTo(this.borderWidth / 2 + i * this.itemGap, this.borderWidth / 2)
            this.ctxBoard?.lineTo(this.borderWidth / 2 + i * this.itemGap, this.borderWidth / 2 + this.rows * this.itemGap)
        }
        this.ctxBoard!.stroke()
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
        canvas.style.zIndex = zIndex || '1'
        return { canvas, ctx }
    }
    bindEvent(canvas: HTMLCanvasElement) {
        if (!canvas) return
        canvas.addEventListener('click', (e) => {
            const boardX = e.clientX - canvas.getBoundingClientRect().left - this.borderWidth / 2
            const boardY = e.clientY - canvas.getBoundingClientRect().top - this.borderWidth / 2
            console.log({
                boardX,
                boardY
            })
            this.clickHandler(boardX, boardY)
        })
    }
    clickHandler(boardX: number, boardY: number) {
        const itemX = +Math.round(boardX / this.itemGap)
        const itemY = +Math.round(boardY / this.itemGap)
        const oldChessType = this.boardProxy[itemX][itemY]
        try {
            this.boardProxy[itemX][itemY] = this.nextChessType
        } catch {
            // 回滚
            this.boardProxy[itemX][itemY] = oldChessType
        }
    }
    // 切换下一次棋子颜色 轮换
    toggleChessType() {
        this.nextChessType = this.nextChessType === 1 ? 2 : 1
    }
    init() {
        this.wrapper = document.createElement('div')
        this.wrapper.style.position = 'relative'
        this.wrapper.id = 'wrapper'
        this.wrapper.style.width = `${this.itemGap * this.rows + this.borderWidth}px`
        this.wrapper.style.height = `${this.itemGap * this.cols + this.borderWidth}px`
        const { canvas, ctx } = this.createCanvasIns({})
        this.canvasBoard = canvas
        this.ctxBoard = ctx
        this.initBoard()
        this.wrapper.appendChild(this.canvasBoard)
        const { canvas: canvasChess, ctx: ctxChess } = this.createCanvasIns({ zIndex: '2', bgColor: 'transparent' })
        this.bindEvent(canvasChess)
        this.canvasChess = canvasChess
        this.ctxChess = ctxChess
        this.wrapper.appendChild(this.canvasChess)
    }
    mount(node: HTMLElement) {
        if (this.wrapper) {
            node.appendChild(this.wrapper)
        }
    }
    isWin(point: number[], chessType: Point): boolean {
        const isValid = (point: number[], chessType: Point) => {
            // 落子在棋盘之内 && point颜色和当前棋子颜色一致
            const [row, col] = point
            console.log({ point, chessType }, chessType === this.boardProxy[col][row])
            return row >= 0 && row < this.rows && col >= 0 && col < this.cols && this.boardProxy[col][row] === chessType
        }
        const createJudgment = (p1Movation: (p1: number[]) => number[], p2Movation: (p2: number[]) => number[]): (point: number[], chessType: Point) => boolean => {
            return (point: number[], chessType: Point): boolean => {
                let count = 1
                let p1 = p1Movation(point)
                let p2 = p2Movation(point)
                while (1) {
                    let p1Changed = false, p2Changed = false
                    console.log({ count, isValidP1: isValid(p1, chessType) })
                    if (isValid(p1, chessType)) {
                        count++
                        p1 = p1Movation(p1)
                        p1Changed = true
                    }
                    if (isValid(p2, chessType)) {
                        count++
                        p2 = p2Movation(p2)
                        p2Changed = true
                    }
                    if (count >= 5) {
                        return true
                    }
                    if (!p1Changed && !p2Changed) {
                        return false
                    }
                }
                return false
            }
        }
        const horJudgment = createJudgment(([row, col]) => [row, col - 1], ([row, col]) => [row, col + 1])
        const verJudgment = createJudgment(([row, col]) => [row - 1, col], ([row, col]) => [row + 1, col])
        const slashJudgement = createJudgment(([row, col]) => [row + 1, col - 1], ([row, col]) => [row - 1, col + 1])
        const backSlashJudgement = createJudgment(([row, col]) => [row + 1, col + 1], ([row, col]) => [row - 1, col - 1])
        return horJudgment(point, chessType) ||
            verJudgment(point, chessType) ||
            slashJudgement(point, chessType) ||
            backSlashJudgement(point, chessType)
    }
    tip() { }

}

export default Gobang
