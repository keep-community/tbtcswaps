import {addDecimalsToUint} from './utils'

test("addDecimalsToUint removes extra decimals", ()=>{
    expect(addDecimalsToUint(1e8.toString(), 8)).toBe('1')
    expect(addDecimalsToUint('00000000000000000', 8)).toBe('0')
    expect(addDecimalsToUint('12340', 3)).toBe('12.34')
})