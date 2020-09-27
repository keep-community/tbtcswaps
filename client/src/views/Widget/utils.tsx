export const toMaxDecimalsFloor = (n: number | string, step: number) => {
    const amount = typeof n === 'string' ? Number(n.replace(',', '.')) : n
    //let factor = Number('1e' + decimals)
    let nRound = Math.floor((amount) * step) / step
    return !isFinite(nRound) ? 0 : nRound
}

export const toMaxDecimalsRound = (n: number | string, step: number) => {
    const amount = typeof n === 'string' ? Number(n.replace(',', '.')) : n
    if (step <= 0) return amount
    //let factor = Number('1e' + decimals)
    let factor = (1 / step)
    let nRound = Math.round((amount) * factor) / factor
    console.log('nroud', step === 1, step, (1 / step))
    return !isFinite(nRound) ? 0 : nRound
}