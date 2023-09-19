interface Gobang {
    name: string;
    row: number,
    col: number,
}
const createGobang = (): Gobang => {
    console.log('gobang')
    return {
        name: 'gobang',
        row: 15,
        col: 15,
    }
}


const add = (a:number, b: number) => {
    return a + b
}
export {
    add
}
export default createGobang